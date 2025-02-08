<script setup>
import HelloWorld from './components/YardSaleView.vue'
import Dashboard from './components/DashboardView.vue'
</script>

<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style scoped>
body, html {

}

.app-container {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}

</style>
