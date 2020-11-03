/*

  1. Parse
  2. Take result and generate function
  3. Iterate through functions and show images

*/

const { parser } = require('./createParser');

let frame = 0;
let imageDisplayFns = [];
let intervalId = 0;
let interval = 500;
let currentFnIndex = 0;

const imageContainer = () => document.querySelector('#picture img');

function * oneLunge () {
  
  const frame = 0;
  let inputFrame = 1;
  let imgStr = 'img/str/' // tagged/${move}/
  let imgNum = inputFrame % 4;
  
  while(true) {
    inputFrame = yield `${imgStr}${imgNum + 1}.jpg`;
    imgNum = inputFrame % 4;
  }
}

function mainLoop () {
  
  if(imageDisplayFns.length < 1) {
    return;
  }
  
  if (!imageDisplayFns[currentFnIndex]) {
    currentFnIndex = 0;
  }
  
  // call current function with the frame number
  const { image, roundComplete } imageDisplayFns[currentFnIndex].next(frame);
  imageContainer.src = image;
  
  if (roundComplete) {
    ++currentFnIndex;
  }
  
}

function frameCounter () {
  setInterval(mainLoop, interval)
}