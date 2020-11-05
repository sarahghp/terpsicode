/*

  1. Parse
  2. Take result and generate function
  3. Iterate through functions and show images

*/

const { parser } = require('./createParser');
const { getMovePath } = require('./utils');
const { globalPhrases, localPhrases } = require('./phrases');

const commandTypes = {
   MOVE:  'MOVE',
   PHRASE: 'PHRASE',
   TIMING:  'TIMING',
};

const phrasingTypes = {
  ACCUMULATION: 'accumulation',
  DECELERATION: 'deceleration',
  RETROGRADE: 'retrograde',
  RONDO: 'rondo',
}

let movesDict;
let intervalId;

let globalFrame = 0;
let imageDisplayFns = [];
let currentDisplayFns = imageDisplayFns;
let interval = 500;
let currentFnIndex = 0;
let globalPhrasing;

const imageContainer = () => document.querySelector('#picture img');

function createMove ({ move, amount, phrase }, { globalFrame, globalPhrasing } = {}) {
  if (!movesDict[move]) {
    return;
  }
    
  const movePath = getMovePath(move);
  const numberOfMoves = amount === 'all' ? movesDict[move].size : amount;
  const updateFns = Object.fromEntries(Object.entries(localPhrases).map(([_, val]) => [_, val()]));

  const moveGen = function* ({ globalFrame, globalPhrasing }) {
    let frame = globalFrame;
    let internalFrame = 0;
    let imageNumber = phrase === 'retrograde' ? numberOfMoves : 1;
    let phraseState;
    const currentPhrase = () => phrase || phraseState || 'default';
    const roundComplete = () => currentPhrase === 'retrograde' ? Boolean(imageNumber == 1) : Boolean(imageNumber == numberOfMoves)
    
    while(true) {
      const display = {
        image: `${movePath}${imageNumber}.jpg`,
        roundComplete: roundComplete(),
      }
      
      console.log('displaying:', move, imageNumber);
      const { globalFrame, globalPhrasing } = yield display;
      frame = globalFrame;
      phraseState = globalPhrasing && globalPhrasing.state;
      ++internalFrame;
      imageNumber = updateFns[currentPhrase()](internalFrame, numberOfMoves);
    }
  }
  
  const initializedFn = moveGen({ globalFrame, globalPhrasing });
  imageDisplayFns.push(initializedFn);
}


function updateTiming({ time }) {
  clearInterval(intervalId);
  interval = time * 1000;
  intervalId = setInterval(mainLoop, interval); 
}

const preprocess = {
  abba: (moves) => {
    const reversedMoves = moves.map((move) => ({ ...move, phrase: phrasingTypes.RETROGRADE })).reverse();
    [ ...moves, ...reversedMoves].forEach((move) => {
      createMove(move)
    });
  }
}

function applyPhrasing({ phrase, moves }) {
  if (globalPhrasing) {
    currentDisplayFns = imageDisplayFns;
  }
  
  if (preprocess[phrase]) {
    preprocess[phrase](moves)
  }
    
  globalPhrasing = {
    state: phrase,
    func: globalPhrases[phrase](),
  }
}

function mainLoop () {
  ++globalFrame;
    
  if(currentDisplayFns.length < 1) {
    return;
  }
  
  if (!currentDisplayFns[currentFnIndex]) {
    currentFnIndex = 0;
  }
  
  if (globalPhrasing && globalPhrasing.func) {
    currentDisplayFns = globalPhrasing.func(currentFnIndex, imageDisplayFns);
    // console.log('CDFs', currentDisplayFns);
  }
    
  const { image, roundComplete } = currentDisplayFns[currentFnIndex]
    .next({ globalFrame, globalPhrasing }).value;  
  imageContainer().src = image;
  
  if (roundComplete) {
    ++currentFnIndex;
  } 
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