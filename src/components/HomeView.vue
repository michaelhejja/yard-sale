<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CountDown from './CountDown.vue'
import MahomesHeader from './MahomesHeader.vue'
import YardSaleService from '../services/YardSaleService'

const router = useRouter()
const products = ref([])
const saleStarted = ref(true)

const startTime = new Date(1739143800000)
let countInterval

onMounted(() => {
  YardSaleService.getAppState()
  .then((result) => {
    products.value = result.data.products
  })

  checkSaleStarted()
  countInterval = setInterval(() => {
    checkSaleStarted()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(countInterval)
})

function checkSaleStarted() {
  const now = Date.now()
  saleStarted.value = now > startTime
  // console.log('Have we Started?', now > startTime)
}

function goToSale() {
  router.push('/yardsale')
}

function goToFaqs() {
  router.push('/faqs')
}

function goToProducts() {
  router.push('/products')
}

</script>

<template>
  <div class="home">
    <div class="texture-overlay"></div>
    <CountDown v-if="!saleStarted"/>
    <MahomesHeader />
    <div class="home-hero">
      <img class="home-hero-img" src="/home-hero.png" alt="CATCH BIG DEALS ON PATRICK MAHOMES FAVORITE PRODUCTS THIS SUPERBOWL. THE FURTHER HE THROWS, THE MORE YOU $$$ SAVE"/>
    </div>
    <div class="hero-footer">
      <div class="hero-footer-item beige">He Wins</div>
      <div class="hero-footer-item green">You Win</div>
      <div class="hero-footer-item red">We Lose!</div>
    </div>

    <button v-if="saleStarted" @click="goToSale()" class="btn-letsgo"></button>

    <div class="floaty-container" @click="goToProducts()">
        <div class="floaty"><img src="/arrow-1.png"/></div>
        <div class="floaty"><img src="/home-floaty.png"/></div>
        <div class="floaty"><img src="/arrow-2.png"/></div>
    </div>

    <div class="all-products">
    <div v-if="products.length > 0" class="all-products-container">
      <div class="product-banner slow">
        <div v-for="(product, index) in products"class="product-banner-item" @click="openModal(index)">
          <img :src="`/${product.image}`" class="product-image-slider" alt="product"/>
        </div>
        <div v-for="(product, index) in products"class="product-banner-item" @click="openModal(index)">
          <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
        </div>
      </div>
    </div>
  </div>
  <div class="all-products">
    <div v-if="products.length > 0" class="all-products-container">
      <div class="product-banner reverse">
        <div v-for="(product, index) in products"class="product-banner-item" @click="openModal(index)">
          <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
        </div>
        <div v-for="(product, index) in products"class="product-banner-item" @click="openModal(index)">
          <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
        </div>
      </div>
    </div>
  </div>
  <div class="all-products">
    <div v-if="products.length > 0" class="all-products-container">
      <div class="product-banner">
        <div v-for="(product, index) in products"class="product-banner-item" @click="openModal(index)">
          <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
        </div>
        <div v-for="(product, index) in products"class="product-banner-item" @click="openModal(index)">
          <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
        </div>
      </div>
    </div>
  </div>
  <div class="all-products">
    <div v-if="products.length > 0" class="all-products-container">
      <div class="product-banner reverse slow">
        <div v-for="(product, index) in products"class="product-banner-item" @click="openModal(index)">
          <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
        </div>
        <div v-for="(product, index) in products"class="product-banner-item" @click="openModal(index)">
          <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
        </div>
      </div>
    </div>
  </div>
  
  <div class="info-container">
    <div class="info-panel" @click="goToFaqs()">
      <div class="hero-footer-item green info-label label-1">HOW IT WORKS</div>
      <p>
        PRODUCTS ARE DISCOUNTED FOR EVERY COMPLETED PASS THROWN BY PATRICK MAHOMES. THE DEEPER THE PASS, THE DEEPER THE DISCOUNT. A 20 YARD BANGER = 20% OFF. BUT ACT FAST. PATRICK’S NEXT PASS RESETS THE DISCOUNT TO THE MOST RECENT YARDAGE GAINED.
      </p>
      <div class="hero-footer-item red info-label label-2">FAQs</div>
    </div>
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
  z-index: 104;
  opacity: 0.5;
  background-repeat: no-repeat;
  background-size: cover;
}

.home {
  width: 87%;

  @media only screen and (max-width: 429px) {
    width: 94%;
  }

  margin: 0 auto;
  padding-top: 30px;

  &::before {
    content: '';
    background-color: var(--black-1);
    position: absolute;
    width: 2px;
    height: 15px;
    left: 50%;
    top: 0px;
  }
}

.home-hero {
  position: relative;
  width: calc(100% - 30px);
  background-color: var(--orange-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);
  font-size: 40px;
  padding: 15px 15px 25px 15px;
  text-align: justify;
  word-spacing: 10px;
  object-fit: contain;
  img {
    width: 100%;
  }

  @media only screen and (max-width: 431px) {
    font-size: 38px;
  }
}

.spaced {
  word-spacing: 73px;

  @media only screen and (max-width: 431px) {
    word-spacing: 69px;
  }
}

.image-overlay {
  width: calc(100% - 30px);
  height: 300px;
  position: absolute;
  top: 0;
  left: 0;
}

.img-overlay {
  position: absolute;
}

.jersey {
  transform: scale(0.9) translate(170px, 54px);

  @media only screen and (max-width: 429px) {
    transform: scale(0.9) translate(162px, 54px);
  }
}

.glasses {
  transform: translate(96px, 135px);

  @media only screen and (max-width: 429px) {
    transform: translate(94px, 127px);
  }
}

.shoe {
  transform: translate(55px, 139px);

  @media only screen and (max-width: 429px) {
    transform: translate(55px, 129px);
  }
}

.taylor {
  transform: translate(264px, 153px);

  @media only screen and (max-width: 429px) {
    transform: translate(254px, 143px);
  }
}

.watch {
  transform: translate(152px, 209px);

  @media only screen and (max-width: 429px) {
    transform: translate(145px, 200px);
  }
}

.ketchup {
  transform: translate(234px, 205px);

  @media only screen and (max-width: 450px) {
    transform: translate(221px, 196px);
  }
}

.grill {
  transform: translate(89px, 248px);

  @media only screen and (max-width: 429px) {
    transform: translate(89px, 240px);
  }
}

.football {
  transform: translate(226px, 252px);

  @media only screen and (max-width: 429px) {
    transform: translate(217px, 244px);
  }
}

.hero-footer {
  display: flex;
  width: 98%;
  margin-left: 1.5%;
  justify-content: space-around;
  transform: translateY(-16px);
}

.hero-footer-item {
  border: 2px solid var(--black-1);
  font-family: "ITC Souvenir";
  font-size: 17px;
  font-weight: 600;
  border-radius: 6px;
  padding: 4px 15px;
  color: var(--black-2);
  text-wrap: nowrap;
  text-transform: uppercase;

  &.beige {
    background-color: var(--beige-1);
  }

  &.green {
    background-color: var(--green-1);
  }

  &.red {
    background-color: var(--red-1);
  }
}

.btn-letsgo {
  background-image: url('/btn-letsgo.svg');
  border: none;
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 125px;
}

.floaty-container {
  position: relative;
  height: 60px;
  display: flex;
  z-index: 100;
}

.floaty {
  width: 25%;
  
  &:nth-child(1) {
    transform: scale(1.3) translate(10px, 10px);
  }

  &:nth-child(2) {
    width: 50%;
  }
  
  &:nth-child(3) {
    transform: scale(0.9) translate(-25px, 21px);
  }

  img {
    width: 100%;
    height: auto;
  }
}

.all-products {
  position: relative;
  height: 180px;
  padding: 7px 0;
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
  margin-bottom: 35px;
}

.product-banner {
  position: absolute; 
  top: 0px; 
  left: 0px; 
  overflow: hidden; 
  white-space: nowrap;
  animation: bannermove 60s linear infinite;
  display: flex;

  &.slow {
    animation: bannermove 100s linear infinite;
  }

  &.reverse {
    animation: bannermove 65s linear infinite reverse;

    &.slow {
      animation: bannermove 110s linear infinite reverse;
    }
  }
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

.info-container {
  position: relative;
}

.info-panel {
  background-color: var(--orange-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);
  position: absolute;
  bottom: 150px;
  left: 15%;
  z-index: 99;
  font-size: 22.72px;
  text-align: left;
  padding: 0 15px;
  width: 61%;
  transform: rotate(-5deg);
}

.info-label {
  width: fit-content;
  position: absolute;

  &.label-1 {
    transform: translate(33px, -14px) rotate(5deg);
  }

  &.label-2 {
    transform: translate(87px, -22px) rotate(-4deg);
  }
}
</style>