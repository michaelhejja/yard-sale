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
const showConfirmation = ref(false)
const currentDiscount = ref(null)
const ws = ref(null)

// Locked In States
const productIsLocked = ref(false)
const lockedProductSoldOut = ref(false)
const lockedProductIndex = ref(0)
const lockedDiscount = ref(0)
const termsAgreed = ref(false)

// Custom Message
const customMessage = ref('')
const customMessageColor = ref('green')
const showCustomMessage = ref(false)

// Product Modal Data
const showModal = ref(false)
const currentIndex = ref(0)

const limitedProducts = computed(() => {
  if (products.value.length === 0) {
    return null
  }
  return products.value.slice(0, 15)
})

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
    if (currentDiscount.value <= 0) {
      const fullPrice = products.value[Number(currentProductIndex.value)].price
      return Number(fullPrice).toFixed(2)
    }

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

const productsTitle = computed(() => {
  if (currentProductOrder.value) {
    console.log(currentProductOrder)
    return currentProductOrder.value.wasLocked ? 'Details will hit your inbox soon' : 'But don\'t worry...'
  } else {
    return 'We\'ve Got More'
  }
})

const productsSubtitle = computed(() => {
  if (currentProductOrder.value) {
    console.log(currentProductOrder)
    return currentProductOrder.value.wasLocked ? 'There\'s More Coming' : 'THERE’S MORE.'
  } else {
    return 'SEE WHAT’S NEXT'
  }
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
      if (currentProductIndex !== obj.message.currentProductIndex) {
        showConfirmation.value = false
        termsAgreed.value = false
      }
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
    } else if (obj.type === 'customMessage') {
      console.log('MESSSAGE!', obj.message)
      customMessage.value = obj.message
      displayCustomMessage()
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
  showConfirmation.value = false
  termsAgreed.value = false
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

function displayCustomMessage() {
  const rand = Math.random()
  if (rand < 0.33) {
    customMessageColor.value = 'green'
  } else if (rand < 0.66) {
    customMessageColor.value = 'red'
  } else {
    customMessageColor.value = 'orange'
  }

  showCustomMessage.value = true
  setTimeout(() => {
    showCustomMessage.value = false
  }, 10000)
}

function openModal(index) {
  currentIndex.value = index
  showModal.value = true
  console.log(products.value[index].name)
}

function showConfirmationState() {
  window.scrollTo(0, 0)
  showConfirmation.value = true
}

function removeConfirmation() {
  showConfirmation.value = false
  termsAgreed.value = false
}

function calculateDiscountPrice (price, discount) {
  if (discount <= 0) {
    return price.toFixed(2)
  }
  const discountAmount = price * (discount / 100)
  const discountPrice = price - discountAmount
  return discountPrice.toFixed(2)
}

function closeModal(index) {
  showModal.value = false
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

    <Transition name="flip">
      <div v-if="showCustomMessage" class="custom-message" :class="customMessageColor">{{ customMessage }}</div>
    </Transition>

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
      <div v-if="(!showConfirmation && !currentProductOrder) || showComingSoon" class="product-showcase">
        <div v-if="appState === 'live'" class="current-discount" :class="{'bgclear': showComingSoon}">
          <div class="current-discount-label">
            {{ currentDiscount }} YARD<br>PASS PLAY
          </div>
          <img src="/icon-plus.svg" />
          <div class="current-discount-percent">
            <div class="current-discount-percent-label">{{ currentDiscount }}%<br>Off</div>
          </div>
        </div>
        <div v-if="appState === 'live' && products.length > 0" class="product-container" :class="{'bgclear': showComingSoon}">
          <div class="product-name">{{ products[currentProductIndex].name }}:</div>
          <div class="product">
            <img :src="`/${products[currentProductIndex].image}`" class="product-image" :class="{'grey': showComingSoon}" alt="product" />
          </div>
          <div class="product-description">{{ products[currentProductIndex].description }}</div>
          <div class="price-container">
            <div class="price">
              <div class="price-label">
                THIS WAS
              </div>
              <div class="price-value">
                ${{ products[currentProductIndex].price.toFixed(2) }}
              </div>
            </div>
            <div class="divider"></div>
            <div class="price-discount">
              <div class="price-label">
                NOW IT'S
              </div>
              <div class="price-value">
                ${{ discountPrice }}
              </div>
            </div>
          </div>
        </div>
        <button v-if="appState === 'live'" class="btn-catch-deal" :disabled="showComingSoon" @click="showConfirmationState()">CATCH THIS DEAL</button>
      </div>
    </Transition>

    <Transition name="flip">
      <div v-if="showModal && products.length > 0" class="modal" :class="{'sold': products[currentIndex].inventory === 0}">
        <div v-if="products[currentIndex].inventory === 0" class="modal-sold-sticker">SOLD</div>
        <div class="modal-header">
            <div class="modal-product-name">{{ products[currentIndex].name }}</div>
            <button class="btn-close" @click="closeModal()"></button>
        </div>
        <div class="modal-product-image">
          <img :src="`/${products[currentIndex].image2}`" alt="product" />
        </div>
        <div class="modal-product-description">{{ products[currentIndex].description }}</div>
        <div class="modal-price-label">
          THIS ITEM IS VALUED AT
        </div>
        <div class="modal-price-value">
          ${{ products[currentIndex].price }}
        </div>
      </div>
    </Transition>

    <Transition name="bounce">
      <div v-if="products.length > 0 && showConfirmation && appState === 'live'" class="confirmation">
        <div class="current-discount-percent-label locked">${{ calculateDiscountPrice(products[currentProductIndex].price, currentDiscount) || '' }}</div>
        <img :src="`/${products[currentProductIndex].image2}`" class="product-image" alt="product" />
        <div class="locked-label green">ARE YOU SURE<br>YOU WANT TO<br>BUY THIS ITEM?</div>
      </div>
    </Transition>
    <div v-if="showConfirmation && appState === 'live'" class="terms-agreement">
      <div class="all-products-title">I agree to <RouterLink to="/terms" class="btn-link">terms and conditions</RouterLink></div>
      <div class="checkbox-wrapper-19">
        <input type="checkbox" id="cbtest-19" v-model="termsAgreed"/>
        <label for="cbtest-19" class="check-box"></label>
      </div>
    </div>

    <Transition name="bounce">
      <div v-if="currentProductOrder && appState === 'live' && !showComingSoon && !showConfirmation" class="product-locked">
        <div v-if="currentProductOrder.wasLocked" class="current-discount-percent-label locked">${{ calculateDiscountPrice(currentProductOrder?.product?.price, currentProductOrder?.discount) || '' }}</div>
        <img :src="`/${currentProductOrder.product.image2}`" class="product-image" alt="product" />
        <div v-if="!currentProductOrder.wasLocked" class="locked-label red">THIS DEAL WAS<br>INTERCEPTED!</div>
        <div v-else class="locked-label">YOU’VE LOCKED<br>THE DEAL!</div>
      </div>
    </Transition>

    <!--<div v-if="currentProductOrder && appState === 'live' && !showComingSoon" class="product-locked-text">
      <div class="locked-message-top">{{ currentProductOrder.wasLocked ? 'Details will hit your inbox soon' : 'But don’t worry...' }}</div>
      <div class="locked-message-bottom">{{ currentProductOrder.wasLocked ? 'There\'s More Coming Up' : 'THERE’S MORE.' }}</div>
    </div>-->

    <div v-if="appState !== 'closed' && !showConfirmation" class="all-products" :class="{'extra-margin': currentProductOrder}">
      <div v-if="!currentProductOrder" class="floaty-1">There's More</div>
      <div v-if="!currentProductOrder" class="floaty-2">All Products</div>
      <div class="all-products-title">{{ productsTitle }}</div>
      <div class="all-products-subtitle">{{ productsSubtitle }}</div>
      <div v-if="products.length > 0" class="all-products-container">
        <div class="product-banner">
          <div v-for="(product, index) in limitedProducts" class="product-banner-item" :key="`product_1_${index}`" @click="openModal(index)">
            <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
          </div>
          <div v-for="(product, index) in limitedProducts" class="product-banner-item" :key="`product_2_${index}`" @click="openModal(index)">
            <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
          </div>
        </div>
      </div>
    </div>
    <!--<div class="divider" v-if="currentProductOrder && appState === 'live' && !showComingSoon"></div>-->

    <MahomesHeader v-if="appState !== 'live'"/>
    <div v-if="!currentProductOrder && appState === 'live' && !showConfirmation" class="footer" :class="{'margin' : appState === 'live'}">
      <button class="btn-back-home" @click="backClicked()">BACK HOME</button>
    </div>
    <div v-if="showConfirmation" class="footer footer-confirmation">
      <button class="btn-footer" @click="catchDeal()" :disabled="!termsAgreed">BUY</button>
      <button class="btn-footer green" @click="removeConfirmation()">GO BACK</button>
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
  z-index: 110;
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
  width: 115%;
  height: 150px;
  top: -58px;
  left: -10px;
  transform: rotate(-15deg);
  font-family: "ITC Souvenir";
  font-size: 37.6px;
  font-weight: 600;
  line-height: 0.9;
  padding-top: 17px;
  animation: float 40s linear infinite;

  @media only screen and (max-width: 429px) {
    font-size: 34px;
  }

  &::after {
    content: '';
    position: absolute;
    background-image: url('/star-beige-2.png');
    background-repeat: no-repeat;
    background-size: contain;
    width: 100%;
    height: 170%;
    z-index: -1;
    top: -22%;
    left: -1px;
  }

  &.locked {
    width: 52%;
    top: 5%;
    left: -1%;

    &::after {
      background-image: url('/star-green-2.svg');
      width: 128%;
      height: 170%;
      z-index: -1;
      top: -47%;
      left: -23px;
      transform: scaleX(1.2);
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

.product-locked, .confirmation {
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
  text-transform: uppercase;

  @media only screen and (max-width: 429px) {
    font-size: 45px;
  }
}

.product-name {
  font-size: 33px;
  margin: 15px;
  text-transform: uppercase;
}

.product {
  margin: 0px 25px;
  display: flex;
}

.product-image {
  max-height: 205px;
  margin: 0px auto;

  &.grey {
    filter: grayscale(1);
  }
}

.product-description {
  font-family: "ITC Souvenir";
  font-size: 15px;
  margin: 0 15px 0 15px;
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

  &.extra-margin {
    margin-top: 75px;
  }

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
    left: 15;
    animation: float-2 10s linear infinite;
  }

  .floaty-2 {
    background-color: var(--green-1);
    bottom: -10px;
    right: 0;
    animation: float 12s linear infinite;
  }

}

.all-products-title {
  font-size: 25px;
  font-family: "ITC Souvenir";
}

.all-products-subtitle {
  font-size: 46px;
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
  height: 120px;

  &.footer-confirmation {
    display: flex;
    justify-content: space-between;
  }

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

.btn-footer {
  font-size: 42px;
  background-color: var(--orange-1);
  border-radius: 6px;
  border: 2px solid var(--black-1);
  text-wrap: nowrap;
  padding: 1px 10px 0px 8px;
  line-height: 0;
  height: 57px;
  width: 49%;
  transition: opacity 0.4s;

  &.green {
    background-color: var(--green-1);
  }

  @media only screen and (max-width: 429px) {
    font-size: 38px;
  }

  &:disabled {
    opacity: 0.6;
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

.custom-message {
  position: fixed;
  width: 86%;
  top: 50px;
  left: 0;
  margin-left: 3%;
  background-color: var(--green-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);
  font-size: 28px;
  padding: 15px 3%;
  z-index: 100;
  text-align: center;

  &.orange {
    background-color: var(--orange-1);
  }

  &.red {
    background-color: var(--red-1);
  }
}

.modal {
  position: fixed;
  z-index: 105;
  width: 90%;
  min-height: 400px;
  top: 100px;
  left: 5%;
  background-color: var(--green-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);

  &.sold {
    background-color: var(--orange-1);
  }
}

.modal-sold-sticker {
  background-color: var(--red-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);
  position: absolute;
  font-size: 48px;
  padding: 10px 15px;
  transform: rotate(-21deg);
  top: 25px;
  left: 15px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
}

.modal-product-name {
  width: 80%;
  font-size: 33.37px;
  text-align: left;
  margin: 15px 0 0 15px;
}

.btn-close {
  width: 43px;
  height: 43px;
  background-color: transparent;
  background-image: url('/close.svg');
  background-repeat: no-repeat;
  background-size: cover;
  margin: 15px 15px 0 0;
}

.modal-product-image {
    width: 80%;
    margin: 0 auto;
    object-fit: cover;

    img {
      width:100%; height:100%;
    }
}

.modal-product-description {
  text-align: left;
  margin: 0 15px;
  font-family: "ITC Souvenir";
  font-size: 15px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--black-1);
}

.modal-price-label {
  text-align: left;
  font-size: 18.33px;
  margin-bottom: 2px;
  margin-left: 15px;
  margin-top: 15px;
}

.modal-price-value {
  text-align: left;
  font-size: 33px;
  font-family: "ITC Souvenir";
  font-weight: 700;
  letter-spacing: 0px;
  margin: 0 15px 15px 15px;
}

.terms-agreement {
  height: 120px;
  margin-top: 55px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 90%;
}
  .checkbox-wrapper-19 {
    box-sizing: border-box;
    --background-color: #fff;
    --checkbox-height: 25px;
  }

  @-moz-keyframes dothabottomcheck-19 {
    0% {
      height: 0;
    }
    100% {
      height: calc(var(--checkbox-height) / 2);
    }
  }

  @-webkit-keyframes dothabottomcheck-19 {
    0% {
      height: 0;
    }
    100% {
      height: calc(var(--checkbox-height) / 2);
    }
  }

  @keyframes dothabottomcheck-19 {
    0% {
      height: 0;
    }
    100% {
      height: calc(var(--checkbox-height) / 2);
    }
  }

  @keyframes dothatopcheck-19 {
    0% {
      height: 0;
    }
    50% {
      height: 0;
    }
    100% {
      height: calc(var(--checkbox-height) * 1.2);
    }
  }

  @-webkit-keyframes dothatopcheck-19 {
    0% {
      height: 0;
    }
    50% {
      height: 0;
    }
    100% {
      height: calc(var(--checkbox-height) * 1.2);
    }
  }

  @-moz-keyframes dothatopcheck-19 {
    0% {
      height: 0;
    }
    50% {
      height: 0;
    }
    100% {
      height: calc(var(--checkbox-height) * 1.2);
    }
  }

  .checkbox-wrapper-19 input[type=checkbox] {
    display: none;
  }

  .checkbox-wrapper-19 .check-box {
    height: var(--checkbox-height);
    width: var(--checkbox-height);
    background-color: transparent;
    border: calc(var(--checkbox-height) * .1) solid #000;
    border-radius: 5px;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    transition: border-color ease 0.2s;
    cursor: pointer;
    transform: scale(1.6);
  }
  .checkbox-wrapper-19 .check-box::before,
  .checkbox-wrapper-19 .check-box::after {
    box-sizing: border-box;
    position: absolute;
    height: 0;
    width: calc(var(--checkbox-height) * .2);
    background-color: #34b93d;
    display: inline-block;
    transform-origin: left top;
    border-radius: 5px;
    content: " ";
    transition: opacity ease 0.5;
  }
  .checkbox-wrapper-19 .check-box::before {
    top: calc(var(--checkbox-height) * .72);
    left: calc(var(--checkbox-height) * .41);
    box-shadow: 0 0 0 calc(var(--checkbox-height) * .05) var(--background-color);
    transform: rotate(-135deg);
  }
  .checkbox-wrapper-19 .check-box::after {
    top: calc(var(--checkbox-height) * .37);
    left: calc(var(--checkbox-height) * .05);
    transform: rotate(-45deg);
  }

  .checkbox-wrapper-19 input[type=checkbox]:checked + .check-box,
  .checkbox-wrapper-19 .check-box.checked {
    border-color: #34b93d;
  }
  .checkbox-wrapper-19 input[type=checkbox]:checked + .check-box::after,
  .checkbox-wrapper-19 .check-box.checked::after {
    height: calc(var(--checkbox-height) / 2);
    animation: dothabottomcheck-19 0.2s ease 0s forwards;
  }
  .checkbox-wrapper-19 input[type=checkbox]:checked + .check-box::before,
  .checkbox-wrapper-19 .check-box.checked::before {
    height: calc(var(--checkbox-height) * 1.2);
    animation: dothatopcheck-19 0.4s ease 0s forwards;
  }
</style>
