<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MahomesHeader from './MahomesHeader.vue'
import YardSaleService from '../services/YardSaleService'

const router = useRouter()
const products = ref([])
const showModal = ref(false)
const showInfo = ref(true)
const currentIndex = ref(0)

onMounted(() => {
  YardSaleService.getAppState()
  .then((result) => {
    products.value = result.data.products
  })

  setTimeout(() => {
    showInfo.value = false
  }, 8000)
})

function openModal(index) {
  currentIndex.value = index
  showModal.value = true
  console.log(products.value[index].name)
}

function closeModal(index) {
  showModal.value = false
}

function goBack() {
  router.push('/yardsale')
}

</script>

<template>
  <div class="texture-overlay"></div>
  
  <Transition name="info1" appear ease-in-out>
    <div v-if="showInfo" class="info-panel">
      PRODUCTS ARE<br>DISCOUNTED FOR EVERY<br>COMPLETED PASS THROWN<br>BY PATRICK MAHOMES. THE<br>DEEPER THE PASS, THE<br>DEEPER THE DISCOUNT. A<br>20 YARD BANGER = 20%<br>OFF. BUT ACT FAST.<br> PATRICK’S NEXT<br>PASS RESETS THE<br>DISCOUNT TO THE<br>MOST RECENT<br>YARDAGE GAINED.
    </div>
  </Transition>

  <Transition name="info2" appear ease-in-out>
    <div v-if="showInfo" class="info-mahomes">
      <img src="/mahomes.png"/>
    </div>
  </Transition>
  
  <Transition name="flip">
    <div v-if="showModal && products.length > 0" class="modal" :class="{'sold': products[currentIndex].inventory === 0}">
      <div v-if="products[currentIndex].inventory === 0" class="modal-sold-sticker">SOLD</div>
      <div class="modal-header">
          <div class="product-name">{{ products[currentIndex].name }}</div>
          <button class="btn-close" @click="closeModal()"></button>
      </div>
      <div class="product-image">
        <img :src="`/${products[currentIndex].image2}`" alt="product" />
      </div>
      <div class="product-description">{{ products[currentIndex].description }}</div>
      <div class="price-label">
        THIS ITEM IS VALUED AT
      </div>
      <div class="price-value">
        ${{ products[currentIndex].price }}
      </div>
    </div>
  </Transition>

  <div class="products">
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
  <div class="all-products">
    <div v-if="products.length > 0" class="all-products-container">
      <div class="product-banner slow">
        <div v-for="(product, index) in products"class="product-banner-item" @click="openModal(index)">
          <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
        </div>
        <div v-for="(product, index) in products"class="product-banner-item" @click="openModal(index)">
          <img :src="`/${product.image}`" class="product-image-slider" alt="product" />
        </div>
      </div>
    </div>
  </div>
  <div class="spacer"></div>
  <MahomesHeader />
  <div class="footer">
    <button @click="goBack()" class="btn-back-home">GO BACK</button>
  </div>
</div>
</template>

<style scoped>

.info-panel {
  background-color: var(--orange-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index: 99;
  font-size: 22.72px;
  text-align: left;
  padding: 15px;
  width: 60%;
}

.info-mahomes {
  position: fixed;
  bottom: -37px;
  right: 10px;
  width: 247px;
  height: 244px;
  z-index: 100;
  transform: rotateZ(-10deg);

  img {
    width: 100%;
    height: auto;
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

.products {
  width: 87%;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
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

.spacer {
  height: 30px;
}

.modal {
  position: fixed;
  z-index: 100;
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

.product-name {
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

.product-image {
    width: 80%;
    margin: 0 auto;
    object-fit: cover;

    img {
        width:100%; height:100%;
    }
}

.product-description {
    text-align: left;
    margin: 15px;
    font-family: "ITC Souvenir";
    font-size: 15px;
    padding-bottom: 15px;
    border-bottom: 2px solid var(--black-1);
}

.price-label {
  text-align: left;
  font-size: 18.33px;
  margin-bottom: 2px;
  margin-left: 15px;
}

.price-value {
  text-align: left;
  font-size: 33px;
  font-family: "ITC Souvenir";
  font-weight: 700;
  letter-spacing: 0px;
  margin: 0 15px 15px 15px;
}

.flip-enter-active {
  animation: flip-in 0.2s;
}
.flip-leave-active {
  animation: flip-in 0.2s reverse;
}
@keyframes flip-in {
  0% {
    opacity: 0.2;
    transform: scale(0) rotateX(45deg) rotateZ(25deg);
  }
  50% {
    transform: scale(1.3) rotateX(60deg) rotateZ(40deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotateX(0deg) rotateZ(0deg);
  }
}

.info1-enter-active {
  animation: info1-in 1s;
}
.info1-leave-active {
  animation: info1-in 0.6s reverse;
}
@keyframes info1-in {
  0% {
    transform: translateY(100%);
  }
  50% {
    transform: translateY(-5%);
  }
  100% {
    transform: translateY(0);
  }
}

.info2-enter-active {
  animation: info2-in 6s;
}
.info2-leave-active {
  animation: info2-in 0.7s reverse;
}
@keyframes info2-in {
  0% {
    transform: translateX(100%) rotateZ(0deg);
  }
  50% {
    transform: translateX(-5%) rotateZ(-5deg);
  }
  100% {
    transform: translateX(0) rotateZ(-10deg);
  }
}

</style>