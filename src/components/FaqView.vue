<script setup>
import MahomesHeader from './MahomesHeader.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function backClicked() {
  router.push('/')
}

function productsClicked() {
  router.push('/products')
}

</script>

<template>
  <div class="terms">
    <div class="texture-overlay"></div>
    <MahomesHeader />
    <div class="banner">
      <img src="/faq-banner.png" alt="Terms & Conditions" />
    </div>
    <div class="title spacer">What is the Patrick Mahomes Yard Sale?</div>
    <p>Yard Sale is a live shopping experiment where every completed pass made by Patrick Mahomes during the Super Bowl determines discount percentages on select products. Instead of traditional purchases, participants enter for a chance to purchase these products at their discounted price.</p>
    <div class="divider"></div>


    <div class="title">How does the Patrick Mahomes Yard Sale work?</div>
    <p>Every time Patrick Mahomes completes a pass during the Super Bowl, the gained yardage determines a featured product's discount percentage. The discount is reset for every completed pass. For instance:</p>
    <p>If Patrick Mahomes completes a 15-yard pass, the featured product is now 15% off. If Patrick’s next completed pass is a 3-yard pass, the same featured product is now 3% off. </p>
    <p>Participants submit their email for a chance to purchase one of the featured products at the final discounted price. If you’re selected for the discount, you’ll be notified via email to complete your check-out.</p>
    <div class="divider"></div>

    <div class="title">Do I have to pay to enter?</div>
    <p>No. Entry is free. Just submit your email address during checkout to participate.</p>
    <div class="divider"></div>

    <div class="title">What happens if I catch a deal?</div>
    <p>If you catch a deal, you will need to enter your email address to be entered for a chance to purchase the product at the discounted price. </p>
    <p>After the Super Bowl, those who caught a deal will be contacted within 48 hours with details on how to claim their purchase. If 48 hours elapse without the participant taking action, another participant will be selected.</p>
    <div class="divider"></div>

    <div class="title">Can I enter multiple times?</div>
    <p>You can enter once per product. Each new product introduced during the game is another chance to enter.</p>
    <div class="divider"></div>

    <div class="title">Can I enter multiple times?</div>
    <p>You can enter once per product. Each new product introduced during the game is another chance to enter.</p>
    <div class="divider"></div>

    <div class="title">What happens to my email address?</div>
    <p>We respect your privacy. Your email will only be used for this event and participant notifications. You will not be placed on an email list, and we will not spam you.</p>
    <div class="divider"></div>

    <div class="title">Can international participants enter?</div>
    <p>At this time, Yard Sale is only open to participants in the United States.</p>
    <div class="divider"></div>

    <div class="title">Is this affiliated with Patrick Mahomes or the NFL?</div>
    <p>No. This is a shopping experiment for experimental and entertainment purposes only.</p>
    <div class="divider"></div>

    <div class="title">Are you profiting from this?</div>
    <p>No. In fact, we’re losing money by offering discounts. We hope you have fun catching deals.</p>
    <div class="divider"></div>

    <div class="footer" :class="{'margin' : appState === 'live'}">
      <button class="btn-back-home" @click="backClicked()">GO HOME</button>
      <button class="btn-back-home green" @click="productsClicked()">ALL ITEMS</button>
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

.banner {
  object-fit: contain;

  img {
    width: 100%;
  }
}

.terms {
  width: 87%;

  @media only screen and (max-width: 429px) {
    width: 89%;
  }

  min-height: 100vh;
  margin: 0 auto;
  padding-top: 30px;
  text-align: left;
}

.title {
  font-size: 18px;
  text-transform: uppercase;
}

p {
  font-size: 15px;
  font-family: "ITC Souvenir";
}

ul {
  font-size: 15px;
  font-family: "ITC Souvenir";
  padding-inline-start: 25px;
}

.spacer {
  margin-top: 10px;
  margin-bottom: 10px;
}

.bold {
  font-weight: 700;
}

.divider {
  width: 100%;
  height: 2px;
  background-color: var(--black-1);
  margin: 20px 0;
}

.footer {
  position: relative;
  height: 120px;
  display: flex;
  justify-content: space-between;

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
  font-size: 42px;
  background-color: var(--orange-1);
  border-radius: 6px;
  border: 2px solid var(--black-1);
  text-wrap: nowrap;
  padding: 1px 10px 0px 8px;
  line-height: 0;
  height: 57px;
  width: 49%;

  &.green {
    background-color: var(--green-1);
  }

  @media only screen and (max-width: 429px) {
    font-size: 38px;
  }
}
</style>