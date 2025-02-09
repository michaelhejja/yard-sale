<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

onMounted(() => {
  const container = document.querySelector('.countdown-container')
  console.log(container)

  var deadline = new Date(1739143800000);
  console.log(deadline)
  var c = new Clock(deadline, function(){ });
  container.appendChild(c.el);
})

function CountdownTracker(label, value){

var el = document.createElement('span');

el.className = 'flip-clock__piece';
el.innerHTML = '<b class="flip-clock__card card"><b class="card__top"></b><b class="card__bottom"></b><b class="card__back"><b class="card__bottom"></b></b></b>' + 
  '<span class="flip-clock__slot">' + label + '</span>';

this.el = el;

var top = el.querySelector('.card__top'),
    bottom = el.querySelector('.card__bottom'),
    back = el.querySelector('.card__back'),
    backBottom = el.querySelector('.card__back .card__bottom');

this.update = function(val){
  val = ( '0' + val ).slice(-2);
  if ( val !== this.currentValue ) {
    
    if ( this.currentValue >= 0 ) {
      back.setAttribute('data-value', this.currentValue);
      bottom.setAttribute('data-value', this.currentValue);
    }
    this.currentValue = val;
    top.innerText = this.currentValue;
    backBottom.setAttribute('data-value', this.currentValue);

    this.el.classList.remove('flip');
    void this.el.offsetWidth;
    this.el.classList.add('flip');
  }
}

this.update(value);
}

// Calculation adapted from https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/

function getTimeRemaining(endtime) {
var t = Date.parse(endtime) - Date.parse(new Date());
return {
  'Total': t,
  'Days': Math.floor(t / (1000 * 60 * 60 * 24)),
  'Hours': Math.floor((t / (1000 * 60 * 60)) % 24),
  'Minutes': Math.floor((t / 1000 / 60) % 60),
  'Seconds': Math.floor((t / 1000) % 60)
};
}

function getTime() {
var t = new Date();
return {
  'Total': t,
  'Hours': t.getHours() % 12,
  'Minutes': t.getMinutes(),
  'Seconds': t.getSeconds()
};
}

function Clock(countdown,callback) {

countdown = countdown ? new Date(Date.parse(countdown)) : false;
callback = callback || function(){};

var updateFn = countdown ? getTimeRemaining : getTime;

this.el = document.createElement('div');
this.el.className = 'flip-clock';

var trackers = {},
    t = updateFn(countdown),
    key, timeinterval;

for ( key in t ){
  if ( key === 'Total' ) { continue; }
  trackers[key] = new CountdownTracker(key, t[key]);
  this.el.appendChild(trackers[key].el);
}

var i = 0;
function updateClock() {
  timeinterval = requestAnimationFrame(updateClock);
  
  // throttle so it's not constantly updating the time.
  if ( i++ % 10 ) { return; }
  
  var t = updateFn(countdown);
  if ( t.Total < 0 ) {
    cancelAnimationFrame(timeinterval);
    for ( key in trackers ){
      trackers[key].update( 0 );
    }
    callback();
    return;
  }
  
  for ( key in trackers ){
    trackers[key].update( t[key] );
  }
}

setTimeout(updateClock,500);
}
</script>

<template>
  <div class="countdown-container">
  </div>
</template>

<style>

.flip-clock {
  text-align: center;
  perspective: 400px;
  margin: 20px auto;
  
  *,
  *:before,
  *:after { box-sizing: border-box; }
}

.flip-clock__piece {
  display: inline-block;
  margin: 0 3px;
  position: relative;
}

.flip-clock__slot {
  font-size: 12px;
  color: black;
  position: absolute;
  top: 3px;
  left: 0;
  width: 100%;
  z-index: 10;
  text-align: center;
  font-family: "ITC Souvenir";
}

.card {
  display: block;
  position: relative; 
  padding-bottom: var(--half-height);
  font-size: 40px;
  line-height: 0.95;
}

.card__top,
.card__bottom,
.card__back::before,
.card__back::after {
  display: block;
  height: var(--half-height);
  color: var(--black-2);
  background: var(--red-1);
  padding: 0.39em 0.25em;
  border-radius: 6px 6px 0 0;
  border: solid 2px var(--black-1);
  backface-visibility: hidden;
  transform-style: preserve-3d;
  width: 1.8em;
  transform: translateZ(0);
}

.card__bottom { 
  color: var(--black-2);
  position: absolute;
  top: 50%;
  left: 0;
  border-top: solid 1px #000;
  
  background: var(--red-1);
  border-radius: 0 0 6px 6px; 
  pointer-events: none;
  overflow: hidden;
}

.card__bottom::after {
  display: block;
  margin-top: -30px;
}

.card__back::before,
.card__bottom::after {
  content: attr(data-value);
}

.card__back {
  position: absolute;
  top: 0;
  height: 100%;
  left: 0%;
  pointer-events: none;
}

.card__back::before {
  position: relative;
  z-index: -1;
  overflow: hidden;
}

.flip .card__back::before {
  animation: flipTop 0.3s cubic-bezier(.37,.01,.94,.35);
  animation-fill-mode: both;
  transform-origin: center bottom;
}

.flip .card__back .card__bottom {
  transform-origin: center top;
  animation-fill-mode: both;
  animation: flipBottom 0.6s cubic-bezier(.15,.45,.28,1);
}

@keyframes flipTop {
  0% {
    transform: rotateX(0deg);
    z-index: 2;
  }
  0%, 99% {
    opacity: 0.99;
  }
  100% {
    transform: rotateX(-90deg);
    opacity: 0;
  }
}

@keyframes flipBottom {
  0%, 50% {
    z-index: -1;
    transform: rotateX(90deg);
    opacity: 0;
  }
  51% {
    opacity: 0.99;
  }
  100% {
    opacity: 0.99;
    transform: rotateX(0deg);
    z-index: 5;
  }
}

</style>