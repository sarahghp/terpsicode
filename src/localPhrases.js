const scrambleEm = (arr) => {
  return arr.reduce((acc, val) => {
    const pos = Math.floor(Math.random() * acc.length);
    acc.splice(pos, 0, val);
    return acc;
  } , [])  
};

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

const retrograde = () => {
  let counter = 1;
  let display;
  return (internalFrame, numberOfMoves) => {
    display = numberOfMoves - (counter % numberOfMoves)
    ++counter;
    return display;
  };
}

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
        
    current = scram[counter];
    ++counter;
    
    return current;
  }
};

exports.localPhrases = {
  accumulation,
  deceleration,
  retrograde,
  random,
  rondo,
  scramble,
  default: () => (internalFrame, numberOfMoves) => (internalFrame % numberOfMoves) + 1,
};

exports.scrambleEm = scrambleEm;
