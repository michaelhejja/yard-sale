<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import MahomesHeader from './MahomesHeader.vue'
const emit = defineEmits(["submitEmail"])
const router = useRouter()
 
const email = ref('')

const isValidEmail = computed(() => {
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/
    return emailRegex.test(email.value)
})

function submitEmail() {
    console.log("trying");
    emit("submitEmail", email.value);
}

function goHome() {
  router.push('/')
}

</script>

<template>
  <div class="email-gate">
    <div class="modal">
        <div class="headline">Welcome</div>
        <div class="subheadline">HOW IT WORKS:</div>
        <p>
            TO ENTER THE YARD SALE, WE<br>FIRST NEED YOUR EMAIL.<br><span class="red">WE WON'T SPAM YOU</span>, WE NEED IT<br>TO LOCK IN YOUR DEAL.
        </p>
        <input v-model="email" type="email" id="email" pattern=".+@example\.com" size="30" required placeholder="name@email.com"/>
        <button @click="submitEmail" class="btn-submit" :disabled="!isValidEmail">Let’s Goooo!</button>
        <RouterLink to="/terms" class="btn-link">Terms of Service</RouterLink>
        <MahomesHeader class="small"/>
    </div>
    <div class="skrim" @click="goHome()"></div>
  </div>
</template>

<style scoped>
.email-gate {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 400;
  animation: appear 0.2s linear;
  animation-delay: 2s;
  animation-fill-mode: both;
  opacity: 0;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.modal {
    position: fixed;
    width: 90%;
    min-height: 400px;
    top: 100px;
    left: 5%;
    background-color: var(--beige-1);
    border-radius: 10px;
    border: 2px solid var(--black-1);
    z-index: 301;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.headline {
    margin-top: 15px;
    font-size: 23.37px;
    font-family: "ITC Souvenir";
}

.subheadline {
    font-size: 48px;
}

p {
    font-size: 28px;
    margin-top: 20px;
}

input {
  font-family: "ITC Souvenir";
  font-size: 16px;
  background: none;
  border: none;
  border-bottom: 1px solid var(--black-1);

  &:-internal-autofill-selected {
    background-color: transparent !important;
  }
}

.red {
  color: var(--red-1)
}

.btn-submit {
    font-family: "ITC Souvenir";
    font-size: 22px;
    line-height: 0.9;
    width: 125px;
    height: 88px;
    background-color: transparent;
    position: relative;
    transition: opacity 0.4s linear;

    &::before {
    content: '';
    position: absolute;
    background-image: url('/star-button.svg');
    background-repeat: no-repeat;
    background-size: cover;
    width: 200px;
    height: 160px;
    z-index: -2;
    top: -40px;
    left: -39px;
    pointer-events: none;
  }

  &:disabled {
    opacity: 0.5;
  }
}

.btn-link {
  color: var(--red-1);
  text-decoration: underline;
  margin-top: 15px;
  font-family: "ITC Souvenir";
  font-weight: 700;;
}

.small {
   transform: scale(0.85);
}

.skrim {
  width: 100vw;
  height: 100vh;
  background-color: black;
  opacity: 0.6;
}
</style>