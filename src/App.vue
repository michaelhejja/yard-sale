<script setup>
import HelloWorld from './components/YardSaleView.vue'
import Dashboard from './components/DashboardView.vue'
</script>

<template>
  <RouterView />
</template>

<style scoped>
body, html {
  background-image: repeating-linear-gradient(#000, #000 2px, #0000 3px, #0000 20px), repeating-linear-gradient(#000, #000 2px, #0000 3px, #0000 20px);
  background-position: 0 0, 100% 0;
  background-repeat: no-repeat, no-repeat;
  background-size: 10px 100%, 10px 100%;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
