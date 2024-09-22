<script setup lang="ts">
const availableStations = await import('~/public/stations.json');
const userPrefsStore = useUserPrefsStore();
const { stations, latestTrips } = storeToRefs(userPrefsStore);

const canvas = ref<HTMLCanvasElement | null>(null);

const printTrips = async (trips) => {
    console.log('Printing trips', trips);

    const ctx = canvas.value?.getContext('2d');

    if (!ctx) {
        return;
    }

    // Load the image asynchronously
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    };

    try {
        const img = await loadImage('/background.png');
        canvas.value.width = img.width;
        canvas.value.height = img.height;
        ctx.drawImage(img, 0, 0);

        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';

        // Draw the trips on the canvas, one by one, with a 20px margin and a 10px margin between each trip information displayed inline, in the following order Date, From, To, Time
        trips.slice(0, 10).forEach((trip, index) => {
            // Convert trip.date to the correct format, DD/MM

            const tripDate = new Date(trip.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
            });

            const tripFrom = trip.from.split(' - ')[0];
            const tripTo = trip.to.split(' - ')[0];

            const tripTime = trip.time.split('-')[0];

            const y = 270 + index * 60;
            ctx.fillText(tripDate, 375, y);
            ctx.fillText(tripFrom, 600, y);
            ctx.fillText(tripTo, 875, y);
            ctx.fillText(tripTime, 1250, y);
        });

        // If there are more than 10 trips, do the same but with a basis y of 2000 instead of 270

        if (trips.length > 10) {
            trips.slice(10, 20).forEach((trip, index) => {
                const tripDate = new Date(trip.date).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                });

                const tripFrom = trip.from.split(' - ')[0];
                const tripTo = trip.to.split(' - ')[0];

                const tripTime = trip.time.split('-')[0];

                const y = 1155 + index * 60;
                ctx.fillText(tripDate, 375, y);
                ctx.fillText(tripFrom, 600, y);
                ctx.fillText(tripTo, 875, y);
                ctx.fillText(tripTime, 1250, y);
            });
        }

        // Download the canvas as an image
        const link = document.createElement('a');
        link.download = 'trips.png';
        link.href = canvas.value.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Failed to load image', error);
    }
};
</script>

<template>
    <div class="prefsContainer">
        <UFormGroup label="Gare 1">
            <USelectMenu v-model="stations[0]" :options="availableStations.default" searchable />
        </UFormGroup>
        <UFormGroup label="Gare 2">
            <USelectMenu v-model="stations[1]" :options="availableStations.default" searchable />
        </UFormGroup>


        <UButton @click="() => latestTrips.push({ from: stations[0], to: stations[1], date: new Date(), time: '' })"
            icon="i-heroicons-plus-20-solid">
            Ajouter un trajet
        </UButton>

        <UButton @click="() => userPrefsStore.$reset()" icon="i-heroicons-trash-20-solid">
            Réinitialiser
        </UButton>

        <UButton @click="() => printTrips(latestTrips)" icon="i-heroicons-printer-20-solid">
            Imprimer
        </UButton>
    </div>
    <canvas ref="canvas" style="display: none;"></canvas>
</template>


<style>
.prefsContainer {
    display: flex;
    flex-direction: column;
    gap: 20px;

    background: #f5f5f5;
    border-radius: 10px;
    border: 1px solid #ddd;
    padding: 20px;
}

@media (max-width: 600px) {
    .prefsContainer {
        width: 90vw;
    }
}
</style>