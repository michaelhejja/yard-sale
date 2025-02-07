<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MahomesHeader from './MahomesHeader.vue'
import YardSaleService from '../services/YardSaleService'

const router = useRouter()
const products = ref([])
const showModal = ref(false)
const currentIndex = ref(0)

onMounted(() => {
  YardSaleService.getAppState()
  .then((result) => {
    products.value = result.data.products
  })
})

function goToSale() {
  router.push('/yardsale')
}

</script>

<template>
  <div class="texture-overlay"></div>
  <div class="home">
    <MahomesHeader />
    
    <button @click="goToSale()">Let's Go!</button>
  </div>
</template>

<style scoped>

.texture-overlay {
  cursor: none;
  pointer-events: none;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: url("/texture.png");
  z-index: 104;
  opacity: 0.5;
  background-repeat: no-repeat;
  background-size: cover;
}

</style>