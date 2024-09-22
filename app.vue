<script setup lang="ts">
</script>

<template>
  <main>
    <set-prefs />

    <trips-table />
  </main>
</template>

<style>
  main {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: min(1000px, 100vw);
    margin: 0 auto;
    gap: 50px;
  }
</style>