<script setup>
import { onMounted, ref } from 'vue'
import YardSaleService from '../services/YardSaleService'

const isActive = ref(false)
const canPurchase = ref(false)
const showComingSoon = ref(false)
const currentProductIndex = ref(0)
const currentDiscount = ref(0)
const products = ref([])
const customMessage = ref('')

onMounted(() => {
  const overlay = document.querySelector('.non-mobile-overlay')
  overlay.classList.add('hide')
  const app = document.querySelector('.app-container')
  app.classList.add('full')

  getData()

  setInterval(() => {
    getData(true)
  }, 5000)
})

function getData(productsOnly = false) {
  YardSaleService.getAppState()
  .then((result) => {
    if (!productsOnly) {
      isActive.value = result.data.isActive
      canPurchase.value = result.data.canPurchase
      showComingSoon.value = result.data.showComingSoon
      currentProductIndex.value = result.data.currentProductIndex
      currentDiscount.value = result.data.currentDiscount
    }
    products.value = result.data.products
  })
}

function saveChanges() {
  YardSaleService.updateAppState(isActive.value, canPurchase.value, showComingSoon.value, currentProductIndex.value, currentDiscount.value)
}

function sendMessage() {
  if (customMessage.value.length > 2) {
    console.log(customMessage.value)
    YardSaleService.sendMessage(customMessage.value)
  }
}

</script>

<template>
  <div class="dashboard">
    <h1>YARD SALE DASHBOARD</h1>
    <div class="form-row">
        <label>The Game is on</label>
        <input v-model="isActive" type="checkbox" />
    </div>
    <div class="form-row">
        <label>Mahomes Has The Ball</label>
        <input v-model="canPurchase" type="checkbox" />
    </div>
    <div class="form-row">
        <label>Sold Out</label>
        <input v-model="showComingSoon" type="checkbox" />
    </div>
    <div class="form-row">
        <label>Current Product</label>
        <input v-model="currentProductIndex" type="number" />
    </div>
    <div class="form-row">
        <label>Current Discount</label>
        <input v-model="currentDiscount" type="number" />
    </div>
    <button class="btn-save" @click="saveChanges()">Save Changes</button>
    <div class="form-row message">
        <div class="message">
          <label>Custom Message</label>
          <textarea class="message" v-model="customMessage" />
        </div>
        <button class="btn-message" @click="sendMessage()">Send</button>
    </div>

    <div class="products-container">
      <div v-for="(product, index) in products" :key="`product_${index}`" class="product">
        <div>{{ index }}</div>
        <div class="name">{{ product.name.substr(0, 20) }}</div>
        <div>ITEMS LEFT:{{ product.inventory }}</div>
      </div>
    </div>

  </div>
</template>

<style scoped>

.dashboard {
  width: 87%;
  margin: 0 auto;
}

h1 {
    padding-bottom: 25px;
    border-bottom: 2px solid var(--black-1);
}

.form-row {
    font-size: 26px;
    margin-bottom: 10px;
    padding-bottom: 15px;
    border-bottom: 2px dashed var(--black-1);
    display: flex;
    justify-content: space-between;
    align-items: center;

    label {
        margin-right: 15px;
    }

    input[type='checkbox'] {
        transform: scale(2);
    }

    input[type='number'] {
        width: 80px;
        font-size: 26px;
    }

    &.message {
      padding-top: 15px;
      padding-bottom: 50px;
      border-top: 2px dashed var(--black-1);
      margin-top: 30px;
      align-items: flex-end;
    }
}

.products-container {
  margin-top: 65px;
}

.product {
  display: flex;
  text-transform: uppercase;
  justify-content: space-between;
  margin: 5px 0;
  font-size: 3vw;
  border-bottom: 1px dashed grey;
}

.btn-save {
  font-size: 52px;
  background-color: var(--green-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);
  border-bottom: 6px solid var(--black-1);
  text-wrap: nowrap;
  width: 100%;
  padding: 5px 15px;
  margin-top: 10px;

  &:active {
    transform: translateY(2px);
    border-bottom: 2px solid var(--black-1);
    margin-top: 14px;
  }
}

.message {
  font-size: 20px;
  width: 100%;
  height: 140px;
  margin-right: 20px;
}

.btn-message {
  font-size: 22px;
  background-color: var(--green-1);
  border-radius: 10px;
  border: 2px solid var(--black-1);
  border-bottom: 6px solid var(--black-1);
  text-wrap: nowrap;
  width: 100px;
  height: 60px;
  padding: 5px 15px;
  margin-top: 10px;

  &:active {
    transform: translateY(2px);
    border-bottom: 2px solid var(--black-1);
    margin-top: 14px;
  }
}
</style>