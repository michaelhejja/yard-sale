<script setup>
import { computed, ref } from 'vue'

</script>

<template>
  <div class="coming-soon">
    <Transition name="slap" appear ease-in-out>
      <div class="sold-sign sign-1">SOLD</div>
    </Transition>
    <Transition name="slap2" appear ease-in-out>
      <div class="sold-sign sign-2">SOLD</div>
    </Transition>
    <Transition name="slap2" appear ease-in-out>
      <div class="sold-sign sign-3">SOLD</div>
    </Transition>
    <Transition name="slap3" appear ease-in-out>
      <div class="sold-sign sign-4">SOLD</div>
    </Transition>
    <Transition name="slap4" appear ease-in-out>
      <div class="sold-sign sign-5">SOLD</div>
    </Transition>
    <Transition name="slap5" appear ease-in-out>
      <div class="sold-sign sign-6">ANOTHER PRODUCT IS COMING SOON!</div>
    </Transition>
  </div>
</template>

<style scoped>
.coming-soon {
  position: absolute;
  top: 160px;
  left: 0;
  width: 100vw;
  max-width: var(--max-width);
  left: 50%;
  margin-left: -215px;
  height: 100vh;
  z-index: 200;
  overflow: hidden;

  @media only screen and (max-width: 429px) {
    margin-left: -195px;
  }
}

.sold-sign {
  position: absolute;
  border-radius: 15px;
  border: 2px solid var(--black-1);
  padding: 5px 10px;
  font-size: 60px;
}

.sign-1 {
  background-color: var(--red-1);
  top: 32%;
  left: 53%;
  transform: scale(1.2) rotateZ(-18deg);
  z-index: 202;
}

.sign-2 {
  background-color: var(--orange-1);
  top: 33%;
  left: -2%;
  font-size: 173px;
  transform: scale(1) rotateZ(18deg);
  z-index: 201;
}

.sign-3 {
  background-color: var(--red-1);
  top: 55%;
  left: 24%;
  transform: scale(1) rotateZ(18deg);
  z-index: 204;
}

.sign-4 {
  background-color: var(--green-1);
  top: 55%;
  left: 34%;
  font-size: 130px;
  transform: scale(1) rotateZ(-22deg);
  z-index: 203;
}

.sign-5 {
  background-color: var(--green-1);
  top: 49%;
  left: 34%;
  font-size: 30px;
  transform: scale(1) rotateZ(-2deg);
  z-index: 205;
  border-radius: 8px;
}

.sign-6 {
  background-color: var(--green-1);
  top: 25%;
  left: 21%;
  width: 54%;
  font-size: 30px;
  transform: scale(1) rotateZ(-2deg);
  z-index: 206;
  border-radius: 8px;
}


.slap-enter-active {
  animation: slap-in 0.4s;
}
.slap-leave-active {
  animation: slap-in 0.3s reverse;
}
@keyframes slap-in {
  0% {
    transform: scale(0) rotateZ(0deg);
  }
  50% {
    transform: scale(1.4) rotateZ(-22deg);
  }
  100% {
    transform: scale(1.2) rotateZ(-18deg);
  }
}

.slap2-enter-active {
  animation: slap-in2 0.6s;
}
.slap2-leave-active {
  animation: slap-in2 0.4s reverse;
}
@keyframes slap-in2 {
  0% {
    transform: scale(0) rotateZ(10deg);
  }
  50% {
    transform: scale(1.2) rotateZ(22deg);
  }
  100% {
    transform: scale(1) rotateZ(18deg);
  }
}

.slap3-enter-active {
  animation: slap-in3 0.8s;
}
.slap3-leave-active {
  animation: slap-in3 0.4s reverse;
}
@keyframes slap-in3 {
  0% {
    transform: scale(0) rotateZ(0deg);
  }
  50% {
    transform: scale(1.2) rotateZ(22deg);
  }
  100% {
    transform: scale(1) rotateZ(-22deg);
  }
}

.slap4-enter-active {
  animation: slap-in4 1.2s;
}
.slap4-leave-active {
  animation: slap-in4 0.4s reverse;
}
@keyframes slap-in4 {
  0% {
    transform: scale(0) rotateZ(0deg);
  }
  50% {
    transform: scale(0.4) rotateZ(22deg);
  }
  75% {
    transform: scale(1.2) rotateZ(-67deg);
  }
  100% {
    transform: scale(1) rotateZ(-2deg);
  }
}

.slap5-enter-active {
  animation: slap-in4 2s;
}
.slap5-leave-active {
  animation: slap-in4 0.4s reverse;
}
@keyframes slap-in5 {
  0% {
    transform: scale(0) rotateZ(0deg);
  }
  50% {
    transform: scale(2) rotateZ(22deg);
  }
  75% {
    transform: scale(1.2) rotateZ(-67deg);
  }
  100% {
    transform: scale(1) rotateZ(-2deg);
  }
}
</style>