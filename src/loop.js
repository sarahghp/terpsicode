const { parser } = require('./createParser');
const { getMovePath } = require('./utils');
const { globalPhrases, localPhrases } = require('./phrases');
const { commandTypes, phrasingTypes } = require('./constants')

const expressionAdjustments = (numToSkip) => ({
  'often': () => Math.random() > .5 ? 1 : numToSkip,
  'sometimes': () => Math.random() > .75 ? 1 : numToSkip,
});

let movesDict;
let intervalId;

let globalFrame = 0;
let imageDisplayFns = [];
let currentDisplayFns = imageDisplayFns;
let interval = 2500;
let currentFnIndex = 0;
let globalPhrasing;

const imageContainer = () => document.querySelector('#picture img');

function createMove ({ move, amount, phrase }) {
  if (!movesDict[move]) {
    return;
  }
  
  const getMovesNumber = (amount) => {
    const totalAvailable = movesDict[move].size;
    if (amount > totalAvailable || amount === 'all') {
      return totalAvailable;
    }
    
    return amount;
  }
  const movePath = getMovePath(move);
  const numberOfMoves = getMovesNumber(amount);
  const updateFns = Object.fromEntries(Object.entries(localPhrases).map(([_, val]) => [_, val()]));

  const moveGen = function* () {
    let frame = globalFrame;
    let internalFrame = 0;
    let imageNumber = phrase === 'retrograde' ? numberOfMoves : 1;
    let phraseState;
    
    const currentPhrase = () => phrase || phraseState || 'default';
    const roundComplete = () => currentPhrase() === 'retrograde' ? Boolean(imageNumber == 1) : Boolean(imageNumber == numberOfMoves)
    
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

function createAbba ({ moves, expression }) {    
  const reversedMoves = moves.map((move) => ({ ...move, phrase: phrasingTypes.RETROGRADE })).reverse();
  return [ ...moves, ...reversedMoves].map((move, idx) => {
    return {
      /* For abba all four must be skipped */
      adjustment: (idx === 0 && expression )? expressionAdjustments(5)[expression] : (() => 1),
      fn: createMove(move)(),
    }
  });
}

function* createCoinFlip({ moves }) {
  const moveOne = createMove(moves[0])();
  const moveTwo = createMove(moves[1])();
  let currentFn;
  let called;
  const getNewFunction = () => Math.random() > .5 ? moveOne : moveTwo;
  
  while(true) {
    let args = {
      globalFrame: 0, globalPhrasing: 1
    }
    
    currentFn = currentFn || getNewFunction();
    called = currentFn.next(args).value;
    args = yield called;
    currentFn = called.roundComplete ? getNewFunction() : currentFn;
  }
};

const createCoinFlipAction = (opts) => {
  return [{
    fn: createCoinFlip(opts),
    adjustment: expressionAdjustments(2)[opts.expression] || (() => 1),
  }];
}

const specialFunctions = {
  'coin_flip': createCoinFlipAction,
  'abba': createAbba,
}

function updateTiming({ time }) {
  clearInterval(intervalId);
  interval = time * 1000;
  intervalId = setInterval(mainLoop, interval); 
}

function applyPhrasing({ phrase, moves, ...opts }) {
  if (globalPhrasing) {
    currentDisplayFns = imageDisplayFns;
  }
  
  globalPhrasing = {
    state: phrase,
    func: globalPhrases[phrase](),
  }
}

function mainLoop () {
  /* If there are no moves, no need to run the function. */
  if(currentDisplayFns.length < 1) {
    return;
  }
  
  /* Otherwise, update frame for next run. */
  ++globalFrame;
      
  /* Apply phasing calls if they exist */
  if (globalPhrasing && globalPhrasing.func) {
    currentDisplayFns = globalPhrasing.func(currentFnIndex, imageDisplayFns);
  }
  
  /* Now get the next image and display it */
  const { image, roundComplete } = currentDisplayFns[currentFnIndex].fn
    .next({ globalFrame, globalPhrasing }).value;  
    
  imageContainer().src = image;
  
  /* 
    If the move has finished its internal cycle, move on to the next move,
    skipping any necessary by calling their adjustment function. 
  */
  if (roundComplete) {
    const lookahead = currentDisplayFns[currentFnIndex + 1] ? currentFnIndex + 1 : 0;
    const increment = currentDisplayFns[lookahead].adjustment();
    currentFnIndex = (currentFnIndex + increment) % currentDisplayFns.length;
  } 
}

function chomp ({ type, ...opts }) {
  switch (type) {
    case commandTypes.MOVE:
       const moveFn = createMove(opts);
       const move = {
         fn: moveFn(),
         adjustment: expressionAdjustments(2)[opts.expression] || (() => 1),
       }
       imageDisplayFns.push(move);
       return;
    case commandTypes.PHRASE:
      return applyPhrasing(opts);
    case commandTypes.RESET:
      currentDisplayFns = imageDisplayFns;
      return;
    case commandTypes.SPECIAL:
      const actions = specialFunctions[opts.name](opts);
      imageDisplayFns.push(...actions);
      return;
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