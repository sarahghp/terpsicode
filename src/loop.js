/*

  1. Parse
  2. Take result and generate function
  3. Iterate through functions and show images

*/

const { parser } = require('./createParser');
const { getMovePath } = require('./utils');

const MOVE = 'MOVE';

let movesDict;
let intervalId;
let currentImage = './clear.png'

let globalFrame = 0;
let imageDisplayFns = [];
let interval = 500;
let currentFnIndex = 0;

const imageContainer = () => document.querySelector('#picture img');

function mainLoop () {
  ++globalFrame;
  
  if(imageDisplayFns.length < 1) {
    return;
  }
  
  if (!imageDisplayFns[currentFnIndex]) {
    currentFnIndex = 0;
  }
    
  const { image, roundComplete } = imageDisplayFns[currentFnIndex].next(globalFrame).value;  
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


function chomp ({ type, ...opts }) {
  if (type === MOVE) {
    // currentImage = `${getMovePath(opts.move)}/1.jpg`
    createMove(opts);
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