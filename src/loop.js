/*

  1. Parse
  2. Take result and generate function
  3. Iterate through functions and show images

*/

const { parser } = require('./createParser');
const { getMovePath } = require('./utils');
const { phrases } = require('./phrases');

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
    console.log('CDFs', currentDisplayFns);
  }
    
  const { image, roundComplete } = currentDisplayFns[currentFnIndex].next({ globalFrame, globalPhrasing }).value;  
  imageContainer().src = image;
  
  if (roundComplete) {
    ++currentFnIndex;
  } 
  
}

function createMove ({ move, amount, phrase = 'default' }, { globalFrame, globalPhrasing } = {}) {
  if (!movesDict[move]) {
    return;
  }
  
  const movePath = getMovePath(move);
  const numberOfMoves = amount === 'all' ? movesDict[move].size : amount;
  
  const updates = {
    default: (internalFrame, numberOfMoves) => (internalFrame % numberOfMoves) + 1,
    retrograde: (internalFrame, numberOfMoves) => numberOfMoves - (internalFrame % numberOfMoves),
    rondo: (() => {
      let counter = 0;
      let lastImage = 1;
      let display;
      
      return (internalFrame, numberOfMoves) => {
      
        
        if (counter % 2 === 0) {
          ++counter;
          return 1;
        }
        
        
        let next = lastImage % numberOfMoves;
        
        if (next === 0) {
          lastImage = 1
        }
        
        display = lastImage + 1;

        ++counter;
        ++lastImage;
                
        return display;
        
      }
    })(),
    
  }

  const moveGen = function* ({ globalFrame, globalPhrasing }) {
    let frame = globalFrame;
    let internalFrame = 0;
    let imageNumber = 1;
    let phraseState = phrase;
    
    while(true) {
      const display = {
        image: `${movePath}${imageNumber}.jpg`,
        roundComplete: Boolean(imageNumber == numberOfMoves),
      }
      
      console.log('displaying:', move, imageNumber);
      const { globalFrame, globalPhrasing } = yield display;
      frame = globalFrame;
      phraseState = globalPhrasing ? globalPhrasing.state : phraseState;
      ++internalFrame;
      imageNumber = updates[phraseState](internalFrame, numberOfMoves);
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

function applyPhrasing({ phrase }) {
  if (globalPhrasing) {
    currentDisplayFns = imageDisplayFns;
  }
  
  globalPhrasing = {
    state: phrase,
    func: phrases[phrase](),
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