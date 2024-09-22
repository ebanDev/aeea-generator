async function fetchWithAuth(url: string): Promise<any> {
    const response = await fetch(url, {
        "credentials": "include",
        "headers": {
            "Authorization": "Basic " + btoa(process.env.SNCF_API_KEY),
        },
    });
    return response.json();
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const queryDate = new Date(query.date).toISOString().slice(0, 10).replace(/-/g, "");

    const departureUrl = `https://api.navitia.io/v1/coverage/sncf/pt_objects?q=${query.from}&type%5B%5D=stop_area&`;
    const arrivalUrl = `https://api.navitia.io/v1/coverage/sncf/pt_objects?q=${query.to}&type%5B%5D=stop_area&`;

    const departureData = await fetchWithAuth(departureUrl);
    const arrivalData = await fetchWithAuth(arrivalUrl);

    const departure = departureData.pt_objects[0].id;
    const arrival = arrivalData.pt_objects[0].id;

    const tripUrl = `https://api.navitia.io/v1/coverage/sncf/journeys?from=${departure}&to=${arrival}&datetime=${queryDate}T000000&count=10&datetime_represents=departure&max_nb_transfers=0`;
    const tripData = await fetchWithAuth(tripUrl);

    const todayTrips = tripData.journeys.filter((trip: any) => trip.departure_date_time.slice(0, 8) == queryDate);

    return todayTrips.map((trip: any) => {
        const startTime = trip.departure_date_time.slice(9, 11) + ':' + trip.departure_date_time.slice(11, 13);
        const endTime = trip.arrival_date_time.slice(9, 11) + ':' + trip.arrival_date_time.slice(11, 13);
        return `${startTime}-${endTime}`;
    });
});