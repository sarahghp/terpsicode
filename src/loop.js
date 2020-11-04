/*

  1. Parse
  2. Take result and generate function
  3. Iterate through functions and show images

*/

const { parser } = require('./createParser');
const { getMovePath } = require('./utils');
const { phrases } = require('./phrases');

const commandTypes = {
   MOVE: 'MOVE',
   PHRASE: 'PHRASE',
   TIMING:  'TIMING',
};

let movesDict;
let intervalId;
let currentImage = './clear.png'

let globalFrame = 0;
let imageDisplayFns = [];
let currentDisplayFns = imageDisplayFns;
let interval = 500;
let currentFnIndex = 0;
let phrasingFn;

const imageContainer = () => document.querySelector('#picture img');

function mainLoop () {
  ++globalFrame;
    
  if(currentDisplayFns.length < 1) {
    return;
  }
  
  if (!currentDisplayFns[currentFnIndex]) {
    currentFnIndex = 0;
  }
  
  if (phrasingFn) {
    currentDisplayFns = phrasingFn(currentFnIndex, imageDisplayFns);
    console.log('CDFs:', currentDisplayFns);
  }
    
  const { image, roundComplete } = currentDisplayFns[currentFnIndex].next(globalFrame).value;  
  imageContainer().src = image;
  
  if (roundComplete) {
    ++currentFnIndex;
  } 
  
}

function createMove ({ move, amount }, globalFrame) {
  if (!movesDict[move]) {
    return;
  }
  
  const movePath = getMovePath(move);
  const numberOfMoves = amount === 'all' ? movesDict[move].size : amount;
  
  const moveGen = function* (globalFrame) {
    let frame = globalFrame;
    let internalFrame = 0;
    let imageNumber = 1;
    
    while(true) {
      const display = {
        image: `${movePath}${imageNumber}.jpg`,
        roundComplete: Boolean(imageNumber == numberOfMoves),
      }
      
      console.log('displaying:', move, imageNumber);
      frame = yield display;
      ++internalFrame;
      imageNumber = (internalFrame % numberOfMoves) + 1;
    }
  }
  
  const initializedFn = moveGen(globalFrame);
  imageDisplayFns.push(initializedFn);
}

function updateTiming({ time }) {
  clearInterval(intervalId);
  interval = time * 1000;
  intervalId = setInterval(mainLoop, interval); 
}

function applyPhrasing({ phrase }) {
  if (phrasingFn ) {
    currentDisplayFns = imageDisplayFns;
  }
  phrasingFn = phrases[phrase]();
}


function chomp ({ type, ...opts }) {
  switch (type) {
    case commandTypes.MOVE:
      return createMove(opts);
    case commandTypes.PHRASE:
      return applyPhrasing(opts);
    case commandTypes.TIMING:
      return updateTiming(opts);
    default:
      return;
  }
}

function startYourEngines (movesCounts) {
  movesDict = movesCounts.reduce((acc, val) => { 
    acc[val.move.toLowerCase()] = val;
    return acc;
  }, {});
  
  intervalId = setInterval(mainLoop, interval);
}

exports.chomp = chomp;
exports.startYourEngines = startYourEngines;