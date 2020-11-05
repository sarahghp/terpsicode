/* local abba is the same as default */
const abba = () => (internalFrame, numberOfMoves) => (internalFrame % numberOfMoves) + 1;

const accumulation = () => {
  let movesThisRound = 1;
  let movesSoFar = 0;
  
  return (internalFrame, numberOfMoves) => {
                    
    if (movesSoFar === movesThisRound) {
      movesThisRound = (movesThisRound % numberOfMoves) + 1;
      movesSoFar = 0;
    }
    
    return ++movesSoFar;
    
  }
};

const deceleration = () => {
  let movesThisRound;
  let movesSoFar = 0;
  let round = 1;
  
  return (internalFrame, numberOfMoves) => {
    
    movesThisRound = movesThisRound || numberOfMoves;
                            
    if (movesSoFar === movesThisRound) {
       --movesThisRound;
      
      if (movesThisRound <= 0) {
        movesThisRound = numberOfMoves;
      }
      
      movesSoFar = 0;
    }
    
    return ++movesSoFar;
    
  }
};

const random = () => (internalFrame, numberOfMoves) => Math.ceil(Math.random() * numberOfMoves);

const retrograde = () => (internalFrame, numberOfMoves) => numberOfMoves - (internalFrame % numberOfMoves);

const rondo = () => {
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
};

const scramble = () => {
  let scram;
  let counter = 0;
  let current;
  
  return (internalFrame, numberOfMoves) => {
    
    if (!scram || counter === numberOfMoves) {
      counter = 0;
      scram = scrambleEm(Array(numberOfMoves).fill().map((_, idx) => idx + 1));
    }
    
    // console.log('***', scram, counter, numberOfMoves);
    
    current = scram[counter];
    ++counter;
    
    return current;
  }
};

exports.localPhrases = {
  abba,
  accumulation,
  deceleration,
  retrograde,
  random,
  rondo,
  scramble,
  default: () => (internalFrame, numberOfMoves) => (internalFrame % numberOfMoves) + 1,
};