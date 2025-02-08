<script setup>
import { ref, onMounted, computed } from 'vue'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import LiveHeader from './LiveHeader.vue'
import EmailGate from './EmailGate.vue'
import ComingSoon from './ComingSoon.vue'
import MahomesHeader from './MahomesHeader.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  msg: String,
})

const userID = ref('undefined')
const userEmail = ref(null)
const userDatabaseID = ref(null)
const title = ref('')
const isActive = ref(true)
const products = ref([])
const orders = ref([])
const currentProductIndex = ref(0)
const canPurchase = ref(true)
const showComingSoon = ref(false)
const currentDiscount = ref(null)
const ws = ref(null)

// Locked In States
const productIsLocked = ref(false)
const lockedProductSoldOut = ref(false)
const lockedProductIndex = ref(0)
const lockedDiscount = ref(0)
const termsAgreed = ref(false)

const currentProductOrder = computed(() => {
  if (products.value.length === 0) {
    return null
  }

  if (orders.value.length > 0) {

    const order = orders.value.find(order => order.product._id === products.value[currentProductIndex.value]._id)
    return order || null
  }
  return null
})

const discountPrice = computed(() => {
  if (products.value.length > 0) {
    const price = products.value[Number(currentProductIndex.value)].price || 0
    const discount = price * (currentDiscount.value / 100)
    const discountPrice = price - discount
    return discountPrice.toFixed(2)
  }
})

const appState = computed(() => {
  if (isActive.value === true) {
    return canPurchase.value === true ? 'live' : 'paused'
  }
  return 'closed'
})

const currentProductSoldOut = computed(() => {
  const numItemsLeft = products.value[currentProductIndex.value].inventory
  return numItemsLeft === 0
})

onMounted(() => {
  createSocketConnection()
})

function createSocketConnection() {
  const wssWebSocket = new WebSocket('wss://yard-sale-server-6f9e6e59ab49.herokuapp.com/')
  ws.value = wssWebSocket

  wssWebSocket.addEventListener("open", () => {
    // Get the fingerprint ID for the user
    var fpPromise = FingerprintJS.load()
    fpPromise
    .then(fp => fp.get())
    .then(result => {
      // This is the visitor identifier:
      const visitorId = result.visitorId
      userID.value = visitorId
      console.log(visitorId)

      const greet = {
        type: 'userid',
        message: visitorId
      }

      // Wait for connecting state
      wssWebSocket.send(JSON.stringify(greet))
    })
  })

  // Listen for websocket messages
  wssWebSocket.addEventListener("message", (event) => {

    const obj = JSON.parse(event.data)
    if (obj.type === 'state') {
      title.value = obj.message.name
      isActive.value = obj.message.isActive
      products.value = obj.message.products
      currentProductIndex.value = obj.message.currentProductIndex
      canPurchase.value = obj.message.canPurchase
      showComingSoon.value = obj.message.showComingSoon
      currentDiscount.value = obj.message.currentDiscount
    }
    else if (obj.type === 'emailconfirmed') {
      userEmail.value = obj.message
    }
    else if (obj.type === 'userdatabaseid') {
      userDatabaseID.value = obj.message
    }
    else if (obj.type === 'orders') {
      console.log(obj.message)
      orders.value = obj.message
    }
  })

  wssWebSocket.addEventListener("close", () => {
    ws.value = null
    setTimeout(createSocketConnection, 2000)
  })
}

function catchDeal() {
  console.log('CATCH THE DEAL!')
  window.scrollTo(0, 0)
  productIsLocked.value = true
  lockedProductIndex.value = currentProductIndex.value
  lockedDiscount.value = currentDiscount.value
  lockedProductSoldOut.value = products.value[lockedProductIndex.value].inventory === 0

  const obj = {
    type: 'catchdeal',
    userDatabaseID: userDatabaseID.value,
    product: products.value[lockedProductIndex.value]._id,
    productIndex: lockedProductIndex.value,
    discount: lockedDiscount.value,
    wasLocked: !currentProductSoldOut.value
  }

  ws.value.send(JSON.stringify(obj))
}

function saveEmail(email) {
  console.log(email)

  const obj = {
    type: 'saveemail',
    userID: userID.value,
    email, email
  }

  ws.value.send(JSON.stringify(obj))
}

function agreeToTerms() {
  termsAgreed.value = true
}

function goToProducts() {
  router.push('/products')
}

function backClicked() {
  router.push('/')
}
</script>

<template>
  <div class="content">
    <EmailGate v-if="!userEmail" @submitEmail="saveEmail" />
    <div class="texture-overlay"></div>
    <ComingSoon v-if="showComingSoon" />
    <LiveHeader :state="appState"/>
    <MahomesHeader v-if="appState === 'live'" :isSad="currentProductOrder && !currentProductOrder.wasLocked && !showComingSoon"/>
    <div v-if="appState === 'paused'" class="message-bench">
      <div class="message-bench-title">Yard Sale Closed</div>
      <div class="message-bench-subtitle">PATRICK IS ON<br>THE BENCH.<br>CHECK BACK SOON.</div>
    </div>
    <div v-if="appState === 'closed'" class="message-bench">
      <div class="message-bench-subtitle">THE END.<br>REGARDLESS OF WHO WON OR LOST.<br><br>YOU WON<br>THE YARD SALE.</div>
      <div class="message-bench-title">Thank You!</div>
    </div>
    <Transition name="slide">
      <div v-if="!currentProductOrder || showComingSoon" class="product-showcase">
        <div v-if="appState === 'live'" class="current-discount" :class="{'bgclear': showComingSoon}">
          <div class="current-discount-label">
            A {{ currentDiscount }} YARD<br>PASS PLAY
          </div>
          <img src="/icon-plus.svg" />
          <div class="current-discount-percent">
            <div class="current-discount-percent-label">{{ currentDiscount }}%<br>Off</div>
          </div>
        </div>
        <div v-if="appState === 'live' && products.length > 0" class="product-container" :class="{'bgclear': showComingSoon}">
          <div class="product-name">{{ products[currentProductIndex].name }}:</div>
          <div class="product">
            <img :src="`/${products[currentProductIndex].image}`" class="product-image" alt="product" />
          </div>
          <div class="product-description">{{ products[currentProductIndex].description }}</div>
          <div class="price-container">
            <div class="price">
              <div class="price-label">
                THIS WAS
              </div>
              <div class="price-value">
                ${{ products[currentProductIndex].price }}
              </div>
            </div>
            <div class="divider"></div>
            <div v-if="currentDiscount && currentDiscount > 0" class="price-discount">
              <div class="price-label">
                NOW IT'S
              </div>
              <div class="price-value">
                ${{ discountPrice }}
              </div>
            </div>
          </div>
        </div>
        <button v-if="appState === 'live'" class="btn-catch-deal" :disabled="showComingSoon" @click="catchDeal()">CATCH THIS DEAL</button>
      </div>
    </Transition>

    <Transition name="bounce">
      <div v-if="currentProductOrder && appState === 'live' && !showComingSoon" class="product-locked">
        <div v-if="currentProductOrder.wasLocked" class="current-discount-percent-label locked">{{ currentProductOrder?.discount || '' }}%<br>Off</div>
        <img :src="`/${currentProductOrder.product.image2}`" class="product-image" alt="product" />
        <div v-if="!currentProductOrder.wasLocked" class="locked-label red">THIS DEAL WAS<br>INTERCEPTED!</div>
        <div v-else class="locked-label">YOU’VE LOCKED<br>THE DEAL!</div>
      </div>
    </Transition>

    <div v-if="appState === 'paused' || !currentProductOrder || showComingSoon" class="all-products" @click="goToProducts()">
      <div class="floaty-1">There's More</div>
      <div class="floaty-2">All Products</div>
      <div class="all-products-title">We’ve Got More</div>
      <div class="all-products-subtitle">SEE WHAT’S NEXT</div>
      <div v-if="products.length > 0" class="all-products-container">
        <div class="product-banner">
          <div v-for="product in products"class="product-banner-item">
            <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
          </div>
          <div v-for="product in products"class="product-banner-item">
            <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
          </div>
        </div>
      </div>
    </div>
    <div class="divider" v-if="currentProductOrder && appState === 'live' && !showComingSoon"></div>

    <div v-if="currentProductOrder && appState === 'live' && !showComingSoon" class="product-locked-text">
      <div class="locked-message-top">{{ currentProductOrder.wasLocked ? 'The info is in the endzone.' : 'But don’t worry...' }}</div>
      <div class="locked-message-bottom">{{ currentProductOrder.wasLocked ? '(YOUR EMAIL INBOX)' : 'THERE’S MORE.' }}</div>
    </div>

    <MahomesHeader v-if="appState !== 'live'"/>
    <div class="footer" :class="{'margin' : appState === 'live'}">
      <button class="btn-back-home" @click="backClicked()">BACK HOME</button>
    </div>
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
  z-index: 100;
  opacity: 0.5;
  background-repeat: no-repeat;
  background-size: cover;
}

.content {
  display: flex;
  flex-direction: column;
  width: 87%;
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;

  @media only screen and (max-width: 429px) {
    width: 90%;
  }
}

.bgclear {
  background-color: transparent;
}

.message-bench {
  margin-top: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--black-1);
}

.message-bench-title {
  font-size: 27px;
  font-family: "ITC Souvenir";
  margin-bottom: 10px;
}

.message-bench-subtitle {
  font-size: 48px;
}

.divider {
  width: 100%;
  height: 2px;
  background-color: var(--black-1);
  margin: 20px 0;
}

.current-discount {
  width: 100%;
  min-height: 85px;
  background-color: var(--green-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;

  &.bgclear {
    background-color: transparent;
  }
}

.current-discount-label {
  font-size: 33px;
  text-align: left;
  margin: 15px;

  @media only screen and (max-width: 429px) {
    font-size: 30px;
  }
}

.current-discount-percent {
  position: relative;
  width: 45%;
}

.current-discount-percent-label {
  position: absolute;
  z-index: 6;
  width: 106%;
  height: 150px;
  top: -42px;
  left: 6px;
  transform: rotate(-15deg);
  font-family: "ITC Souvenir";
  font-size: 37.6px;
  font-style: italic;
  font-weight: 700;
  animation: float 40s linear infinite;

  @media only screen and (max-width: 429px) {
    font-size: 34px;
  }

  &::after {
    content: '';
    position: absolute;
    background-image: url('/star.svg');
    background-repeat: no-repeat;
    background-size: contain;
    width: 100%;
    height: 170%;
    z-index: -1;
    top: -22%;
    left: -1px;
  }

  &::before {
    content: '';
    position: absolute;
    background-image: url('/star-shadow.svg');
    background-repeat: no-repeat;
    background-size: contain;
    width: 100%;
    height: 170%;
    z-index: -2;
    top: -14%;
    left: -3px;
  }

  &.locked {
    width: 50%;
    top: 12%;
    left: 4%;

    &::after {
      background-image: url('/star-green.svg');
    }
  }
}

.product-container {
  margin-top: 10px;
  position: relative;
  width: 100%;
  object-fit: contain;
  background-color: var(--orange-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);
  text-align: left;

  &.bgclear {
    background-color: transparent;
  }
}

.product-locked {
  position: relative;
  width: 100%;
  object-fit: contain;
  background-color: var(--orange-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.terms {
  margin-top: 25px;
  text-align: left;
  border-radius: 10px;
  border: 2px solid var(--black-1);
  font-family: "ITC Souvenir";

  h4 {
    font-family: "Azo Sans 2";
    font-size: 15px;
    margin-left: 15px;
  }

  p {
    font-size: 11px;
    margin: 0 15px 15px 15px;
  }
}

.btn-terms {
  background-color: var(--red-1);
  font-family: "ITC Souvenir";
  border-radius: 6px;
  border: 2px solid var(--black-1);
  text-transform: uppercase;
  padding: 5px 15px;
  font-size: 24px;
  font-weight: 700;
  margin-left: 50%;
  transform: translateX(-50%) translateY(30%) rotate(3deg);
}

.locked-label {
  font-size: 48px;
  background-color: var(--green-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);
  text-wrap: nowrap;
  padding: 5px 15px;
  position: absolute;
  bottom: -50px;
  text-align: center;
  transform: rotate(-3deg);
  left: 9%;

  @media only screen and (max-width: 429px) {
    left: 6%;
    font-size: 45px;
  }

  &.red {
    background-color: var(--red-1);
    transform: rotate(3deg);
  }
}

.locked-message-top {
  font-size: 27px;
  font-family: "ITC Souvenir";
  text-wrap: nowrap;
  margin-top: 28px;
}

.locked-message-bottom {
  font-size: 48px;
  text-wrap: nowrap;

  @media only screen and (max-width: 429px) {
    font-size: 45px;
  }
}

.product-name {
  font-size: 33px;
  margin: 15px
}

.product {
  margin: 0 25px;
}

.product-image {
  width: 100%;
  height: auto;
  max-height: 600px;
}

.product-description {
  font-family: "ITC Souvenir";
  font-size: 15px;
  margin: 15px 15px 0 15px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--black-1);
}

.price-container {
  display: flex;
  flex-wrap: nowrap;
  height: 80px;

  .divider {
    width: 2px;
    height: 65px;
    margin-top: 0;
    background-color: var(--black-1);
  }
}

.price, .price-discount {
  position: relative;
  margin: 10px 15px;
  width: 49%;
}

.price {
  &::after {
    content: '';
    position: absolute;
    background-image: url('/crossout.svg');
    background-repeat: no-repeat;
    background-size: contain;
    width: 100%;
    height: 100%;
    z-index: 2;
    top: 38%;
    left: 0;
  }
}

.price-label {
  font-size: 18.33px;
  margin-bottom: 2px;
}

.price-value {
  font-size: 33px;
  font-family: "ITC Souvenir";
  font-weight: 700;
  letter-spacing: 0px;
}

.btn-catch-deal {
  font-size: 48px;
  background-color: var(--green-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);
  text-wrap: nowrap;
  width: 100%;
  padding: 5px 15px;
  margin-top: 10px;

  &:disabled {
    background-color: transparent;
    color: var(--black-1);
  }
}

.all-products {
  position: relative;
  margin-top: 20px;

  .floaty-1, .floaty-2 {
    font-family: "ITC Souvenir";
    border-radius: 6px;
    border: 2px solid var(--black-1);
    text-transform: uppercase;
    position: absolute;
    padding: 5px 8px;
    font-size: 17px;
    font-weight: 700;
    z-index: 100;
  }

  .floaty-1 {
    background-color: var(--red-1);
    top: 90px;
    left: 0;
    animation: float 10s linear infinite;
  }

  .floaty-2 {
    background-color: var(--green-1);
    bottom: -10px;
    right: 0;
    animation: float 12s linear infinite;
  }

}

.all-products-title {
  font-size: 27px;
  font-family: "ITC Souvenir";
}

.all-products-subtitle {
  font-size: 48px;
}

.all-products-container {
  height:150px; 
  position:relative;
  margin-bottom: 55px;

  @media only screen and (max-width: 429px) {
    margin-bottom: 55px;
  }
}

.product-banner {
  position: absolute; 
  top: 0px; 
  left: 0px; 
  overflow: hidden; 
  white-space: nowrap;
  animation: bannermove 80s linear infinite;
  display: flex;
}

.product-banner-item {
  width: 150px;
  object-fit: contain;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  border: 2px solid var(--black-1);
  margin: 10px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--beige-1);

  img {
    width: 90%;
    margin: 0 auto;
    height: auto;
  }
}

@keyframes bannermove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-50%, 0);
  }
}

.footer {
  position: relative;
  height: 100px;

  &::before {
    content: '';
    background-color: var(--black-1);
    position: absolute;
    width: 2px;
    height: 15px;
    left: 50%;
    bottom: 0px;
  }

  &.margin {
    margin-top: 30px;
  }
}

.btn-back-home {
  font-size: 48px;
  background-color: var(--orange-1);
  border-radius: 6px;
  border: 2px solid var(--black-1);
  text-wrap: nowrap;
  padding: 0px 10px;
}

/*  Animations */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: none;
}
@keyframes bounce-in {
  0% {
    transform: scale(0) translateX(100%);
  }
  50% {
    transform: scale(0.5) translateX(-10%);
  }
  100% {
    transform: scale(1) translateX(0);
  }
}

.flip-enter-active {
  animation: flip-in 0.5s;
}
.flip-leave-active {
  animation: flip-in 0.5s reverse;
}
@keyframes flip-in {
  0% {
    transform: scale(0) rotateX(45deg);
  }
  50% {
    transform: scale(1.1) rotateX(60deg);
  }
  100% {
    transform: scale(1) rotateX(0deg);
  }
}

.slide-enter-active {
  animation: slide-in 0.4s;
}
.slide-leave-active {
  animation: none;
}
@keyframes slide-in {
  0% {
    transform: translate(100%, 0)
  }
  50% {
    transform: translate(120%, 0)
  }
  100% {
    transform: translate(0, 0)
  }
}
</style>
