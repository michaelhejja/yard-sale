<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

defineProps({
  isSad: false
})

let animationInterval

onMounted(() => {
  animationInterval = setInterval(() => {
    // console.log('WOOOOO!')
  }, 2000)
})

onUnmounted(() => {
  clearInterval(animationInterval)
})
</script>

<template>
  <div class="mahomes-header">
    <div class="label">Patrick Mahomes</div>
    <img
      class="mahomes"
      :class="{'sad':isSad}"
      :src="isSad ? 'SadMahomes.png' : '/mahomes.png'"
      alt="Patrick Mahomes" />
  </div>
</template>

<style scoped>
.mahomes-header {
  width: 100%;
  margin-top: 15px;
  color: var(--black-1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("/Yardsale.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center bottom;
  margin-top: auto;
  overflow: hidden;

  img {
    width: 38%;
    margin-top: 12px;
  }
}

.label {
  font-family: "ITC Souvenir";
  font-size: 27px;
  line-height: 1;
}

.mahomes {
  animation: mahomes-wiggle 2s linear infinite;

  &.sad {
    animation: mahomes-cry 1s linear infinite;
  }
}
</style>