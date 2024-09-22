export const useUserPrefsStore = defineStore('userPrefs', () => {
    const stations = ref(['Bordeaux', 'Nantes']);
    const latestTrips = ref(Array.from({ length: 10 }, () => ({
        from: '',
        to: '',
        date: new Date(),
        time: '',
    })));

    function $reset() {
        latestTrips.value = Array.from({ length: 10 }, () => ({
            from: stations.value[0],
            to: stations.value[1],
            date: new Date(),
            time: '',
        }));
    }

    return {
        stations,
        latestTrips,
        $reset
    };
}, {
    persist: {
        storage: persistedState.localStorage,
    }
});