<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  state: String, // live, paused, or closed
})

const title = computed(() => {
  if (props.state === 'live') {
    return 'live'
  } else if (props.state === 'paused') {
    return 'on bench'
  } else {
    return 'closed'
  }
})

</script>

<template>
  <div class="live-header">
    <div class="label" :class="{'bench': state === 'paused', 'closed': state === 'closed'}">{{ title }}</div>
  </div>
</template>

<style scoped>
.live-header {
  width: 100%;
  padding: 12px 0 0 0;
  margin-bottom: 0px;
  color: var(--black-1);
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  z-index: 10;
}

.label {
  line-height: 1;
  font-size: 26px;
  background-color: var(--red-1);
  padding: 5px 15px;
  border-radius: 6px;
  border: 2px solid var(--black-1);

  &.bench {
    background-color: var(--orange-1);
  }

  &.closed {
    background: none;
  }

  &::before {
    content: '';
    background-color: var(--black-1);
    position: absolute;
    width: 2px;
    height: 8px;
    left: 50%;
    top: 0px;
  }
}
</style>