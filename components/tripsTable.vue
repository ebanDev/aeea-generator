<script setup>
import { format } from 'date-fns';
import DatePicker from './DatePicker.vue';
const userPrefsStore = useUserPrefsStore();
const { stations, latestTrips } = storeToRefs(userPrefsStore);

const columns = [{
    key: 'from',
    label: 'Départ',
    width: '1/4',
}, {
    key: 'to',
    label: 'Arrivée',
    width: '1/4',
}, {
    key: 'date',
    label: 'Date',
    width: '1/4',
}, {
    key: 'time',
    label: 'Horaires',
    width: '1/4',
}];

const updateDirection = (row) => {
    row.to = stations.value.find((station) => station !== row.from);
}

const loadTrips = (row) => {
    $fetch(`/api/getTrips?from=${row.from}&to=${row.to}&date=${row.date}`)
        .then((data) => {
            console.log('Trips loaded', data);
            row.availableTimes = data;
        })
} 
</script>

<template>
    <client-only>
        <UTable :rows="latestTrips" :columns="columns">
            <template #from-data="{ row }">
                <USelect :options="stations" v-model="row.from" @change="updateDirection(row)" />
            </template>
            <template #date-data="{ row }">
                <UPopover :popper="{ placement: 'bottom-start' }">
                    <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(row.date, 'd MMM, yyy')" />

                    <template #panel="{ close }">
                        <DatePicker v-model="row.date" is-required @close="() => { close(); loadTrips(row); }" />
                    </template>
                </UPopover>
            </template>
            <template #time-data="{ row }">
                <USelect :options="row.availableTimes" v-model="row.time" />
            </template>
        </UTable>
    </client-only>
</template>

<style>
table {
    background: #f5f5f5;
    border-radius: 10px;
    border: 1px solid #ddd;
}

@media (max-width: 600px) {
    table {
        display: block;
        overflow-x: scroll;
        max-width: 90vw;

        td {
            min-width: 150px;
        }
    }
}
</style>