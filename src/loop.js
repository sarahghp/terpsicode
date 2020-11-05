/*

  1. Parse
  2. Take result and generate function
  3. Iterate through functions and show images

*/

const { parser } = require('./createParser');
const { getMovePath } = require('./utils');
const { globalPhrases, localPhrases } = require('./phrases');

const commandTypes = {
  COIN_FLIP: 'COIN_FLIP',
  EXPRESSION: 'EXPRESSION',
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

function createMove ({ move, amount, phrase }) {
  if (!movesDict[move]) {
    return;
  }
    
  const movePath = getMovePath(move);
  const numberOfMoves = amount === 'all' ? movesDict[move].size : amount;
  const updateFns = Object.fromEntries(Object.entries(localPhrases).map(([_, val]) => [_, val()]));

  const moveGen = function* () {
    let frame = globalFrame;
    let internalFrame = 0;
    let imageNumber = phrase === 'retrograde' ? numberOfMoves : 1;
    let phraseState;
    
    const currentPhrase = () => phrase || phraseState || 'default';
    const roundComplete = () => currentPhrase === 'retrograde' ? Boolean(imageNumber == 1) : Boolean(imageNumber == numberOfMoves)
    
    while(true) {
      let display = {
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
  
  return moveGen;
}

function* createCoinFlip({ moves }) {
  const moveOne = createMove(moves[0])();
  const moveTwo = createMove(moves[1])();

  
  while(true) {
    let args = {
      globalFrame: 0, globalPhrasing: 1
    }
    
    let currentFn = Math.random() > .5 ? moveOne : moveTwo;
    args = yield currentFn.next(args).value;
  }
  
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
      imageDisplayFns.push(createMove(move)());
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
  }
  
  // console.log('CDFs', currentDisplayFns);

    
  const { image, roundComplete } = currentDisplayFns[currentFnIndex].fn
    .next({ globalFrame, globalPhrasing }).value;  
    
  imageContainer().src = image;
  
  if (roundComplete) {
    const lookahead = currentDisplayFns[currentFnIndex + 1] ? currentFnIndex + 1 : 0;
    const increment = currentDisplayFns[lookahead].adjustment();
    currentFnIndex = (currentFnIndex + increment) % currentDisplayFns.length;
  } 
}

const expressionAdjustments = {
  'often': () => Math.random() > .5 ? 1 : 2,
  'sometimes': () => Math.random() > .75 ? 1 : 2,
}

function chomp ({ type, ...opts }) {
  switch (type) {
    case commandTypes.COIN_FLIP:
      const coinFlip = {
        fn: createCoinFlip(opts),
        adjustment: () => 1,
      }
      imageDisplayFns.push(coinFlip);
      return;
    case commandTypes.EXPRESSION:
      const expression = {
        fn: createMove(opts.moves[0])(),
        adjustment: expressionAdjustments[opts.expression],
      };
      imageDisplayFns.push(expression);
      return;
    case commandTypes.MOVE:
       const moveFn = createMove(opts);
       const move = {
         fn: moveFn(),
         adjustment: () => 1,
       }
       imageDisplayFns.push(move);
       return;
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