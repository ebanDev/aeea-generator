<script setup lang="ts">
onMounted(() => {
  useHead({
    title: 'AEEA Generator',
    meta: [
      {
        name: 'description',
        content: 'A simple app to manage your trips using AEEA'
      }
    ]
  })
});
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
  align-items: start;
  justify-content: center;
  height: 100vh;
  width: min(1200px, 100vw);
  margin: 0 auto;
  gap: 50px;
  padding: 20px;
}

@media (max-width: 600px) {
  main {
    flex-direction: column;
    gap: 20px;
  }
}
</style>