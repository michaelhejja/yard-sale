<script setup>
import { onMounted, ref } from 'vue'
import YardSaleService from '../services/YardSaleService'

const orders = ref([])

onMounted(() => {
  const overlay = document.querySelector('.non-mobile-overlay')
  overlay.classList.add('hide')
  const app = document.querySelector('.app-container')
  app.classList.add('full')

  getData()

  setInterval(() => {
    getData()
  }, 5000)
})

function getData() {
  YardSaleService.getAllOrders()
  .then(result => {
    orders.value = result.data
    console.log(result.data)
  })
}

// const sortedOrders = computed(() => {
//   if (orders.value.length > 0) {
//     const sorted = orders.value.sort((a, b) => {
//       
//     })
//   }
// })

function calculateDiscountPrice (price, discount) {
  if (discount <= 0) {
    return Number(price).toFixed(2)
  }
  const discountAmount = price * (discount / 100)
  const discountPrice = price - discountAmount
  return discountPrice.toFixed(2)
}

</script>

<template>
  <div class="orders">
    <h1>ORDERS</h1>
    <div class="order header">
      <div class="col-1">User Email</div>
      <div class="col-2">Product</div>
      <div class="col-3">Discount</div>
      <div class="col-4">Caught or Not</div>
      <div class="col-5">Final Price</div>
    </div>

    <div v-for="order in orders" class="order">
      <div class="col-1">{{ order.user.email }}</div>
      <div class="col-2">{{ order.product.name }}</div>
      <div class="col-3">{{ order.discount }}% off</div>
      <div class="col-4" :class="{'green': order.wasLocked}">{{ order.wasLocked ? 'CAUGHT' : 'INTERCEPTED' }}</div>
      <div class="col-5">${{ calculateDiscountPrice(order.product.price, order.discount) }}</div>
    </div>
  </div>
</template>

<style scoped>

.orders {
  width: 87%;
  margin: 0 auto;
  font-family: "ITC Souvenir";
  text-align: left;
  font-size: 16px;

  @media only screen and (max-width: 1000px) {
    font-size: 13px;
  }
}

.order {
  padding: 10px 0;
  border-bottom: 1px dashed grey;
  display: flex;
  justify-content: flex-start;

  &.header {
    text-transform: uppercase;
    font-weight: 700;
  }
}

.col-1 {
  width: 25%;
}

.col-2 {
  width: 35%;
}

.col-3 {
  width: 15%;
}

.col-4 {
  width: 15%;
  color: var(--red-1);

  &.green {
    color: var(--green-2);
  }
}
.col-5 {
  margin-left: auto;
}

</style>