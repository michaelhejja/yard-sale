<script setup>
import MahomesHeader from './MahomesHeader.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function backClicked() {
  router.back()
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
      <img src="/terms-banner.svg" alt="Terms & Conditions" />
    </div>
    <div class="title spacer">Yard Sale Digital Event - Terms and Conditions</div>
    <div class="title">Effective Date:</div>
    <p>February 9th, 2025<br><br>Welcome to the Yard Sale digital event ("Yard Sale"). By participating in this event, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with these Terms, please do not participate in Yard Sale.</p>
    <div class="divider"></div>
    <div class="title">1. Overview</div>
    <p>Yard Sale is an experimental digital activation designed solely for entertainment purposes. Participation in Yard Sale does not constitute entry into a sweepstakes, lottery, or raffle. No purchase is necessary to participate.</p>
    <div class="title">2. No Affiliation with Patrick Mahomes or Any Third Parties</div>
    <p>Yard Sale is not sponsored, endorsed, or affiliated with Patrick Mahomes, the National Football League (NFL), or any of its related entities. Any references to Patrick Mahomes are for thematic and entertainment purposes only.</p>
    <div class="title">3. Participation & Eligibility</div>
    <ul>
      <li>Participants must be <span class="bold">18 years of age or older</span> and reside in the United States.</li>
      <li>Participation in Yard Sale is voluntary and does not guarantee receipt of any product or prize.</li>
      <li>By submitting an entry, participants acknowledge that they are engaging in a digital activation with randomized outcomes.
      </li>
    </ul>
    <div class="title">4. No Guarantees on Product Receipt</div>
    <ul>
      <li>Entering Yard Sale does not guarantee that a participant will have the right to purchase or receive an item.</li>
      <li>Selection of participants who may be eligible to purchase an item is determined at the discretion of Yard Sale team.</li>
      <li>Participants <span class="bold">do not</span> have legal ownership or claim to any product unless explicitly confirmed by Yard Sale.</li>
    </ul>
    <div class="title">5. Taxes & Shipping Responsibilities</div>
    <ul>
      <li>Participants who purchase an item are solely responsible for any <span class="bold">state, or federal taxes</span> associated with the receipt of the item.</li>
      <li>Participants are responsible for <span class="bold">any applicable shipping and handling costs</span>, which will be communicated upon confirmation of receipt.</li>
      <li>Failure to cover shipping costs within the specified time may result in forfeiture of the item.</li>
    </ul>
    <div class="title">6. Delivery & Fulfillment</div>
    <ul>
      <li>Delivery times for items will vary and are subject to product availability, supplier logistics, and external shipping constraints.</li>
      <li>Yard Sale is not liable for lost, damaged, or delayed shipments.</li>
    </ul>
    <div class="title">7. Limitation of Liability</div>
    <ul>
      <li>Participation in Yard Sale is at the participant’s own risk.</li>
      <li>Yard Sale does not guarantee the availability, quality, or usability of any items provided.</li>
      <li>Yard Sale is not responsible for any technical malfunctions, interruptions, or errors that may affect participation in Yard Sale.</li>
    </ul>
    <div class="title">8. Data Usage & Privacy</div>
    <ul>
      <li>By participating, you consent to Yard Sale collecting and processing your provided information for the purpose of facilitating the event.</li>
      <li>Your information will not be sold to third parties and will only be used for communication-related to this activation.</li>
    </ul>
    <div class="title">9. Changes & Termination</div>
    <ul>
      <li>Yard Sale reserves the right to <span class="bold">suspend, or terminate</span> Yard Sale at any time without prior notice.</li>
      <li>Any changes to these Terms will be updated on this page, and continued participation constitutes acceptance of the revised Terms.</li>
    </ul>
    <div class="title">10. Contact Information</div>
    <p>For any questions or concerns regarding these Terms, please contact us at info@yardsale.market.
      By participating in Yard Sale, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
    </p>
    <div class="divider"></div>
    <div class="footer">
      <button class="btn-back-home" @click="backClicked()">GO BACK</button>
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

.terms {
  width: 87%;
  min-height: 100vh;
  margin: 0 auto;
  padding-top: 30px;
  text-align: left;
}

.banner {
  object-fit: contain;

  img {
    width: 100%;
  }
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