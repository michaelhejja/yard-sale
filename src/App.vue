<script setup>
</script>

<template>
  <div class="app-container">
    <div class="non-mobile-overlay">
      <div class="texture-overlay"></div>
      <div class="non-mobile-text">THIS IS A MOBILE EXPERIENCE. PLEASE VISIT ON YOUR MOBILE DEVICE!</div>
      <img class="non-mobile-mahomes" src="/mahomes.png" />
    </div>
    <RouterView class="router"/>
  </div>
</template>

<style scoped>
body, html {

}

.app-container {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;

  &.full {
    max-width: 100%;
  }
}

.non-mobile-overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: var(--beige-1);
  z-index: 1000;
  display: none;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  display: none;

  @media only screen and (min-width: 640px) {
    display: flex;

    &.hide {
      display: none;
    }
  }
}

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

.non-mobile-text {
  font-size: 48px;
  width: 62%;
  max-width: 750px;
}

.non-mobile-mahomes {
  position: fixed;
  bottom: 0;
  right: 20%;
  transform: scale(1.2) rotateZ(-10deg);
}

</style>
