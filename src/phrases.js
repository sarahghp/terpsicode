const abba = () => { /* this is a no op here because it is preprocessed */};

const accumulation = () => {
  let round = 0;
  let display;

  return (currentFnIndex, imageDisplayFns) => {
        
    if (currentFnIndex == 0) { // a new round has started
      display = imageDisplayFns.slice(0, round + 1);
      round = ++round % imageDisplayFns.length;
    }
    
    return display || imageDisplayFns;
    
  }
};

const deceleration = () => {
  let round = 0;
  let display;

  return (currentFnIndex, imageDisplayFns) => {
        
    if (currentFnIndex == 0) { // a new round has started
      display = imageDisplayFns.slice(0, imageDisplayFns.length - round);
      round = ++round % imageDisplayFns.length;
    }
    
    return display || imageDisplayFns;
    
  }
}

const retrograde = () => (currentFnIndex, imageDisplayFns) => {
  return [...imageDisplayFns].reverse();
};

const rondo = () => {
  let counter = 0;
  let next;
  
  return (currentFnIndex, imageDisplayFns) => {
    next = counter + 1;
    
    if (next === imageDisplayFns.length) {
      next = 1;
      counter = 0;
    }
    
    ++counter;
      
    return [imageDisplayFns[0], imageDisplayFns[next]];;
    
  }
}

const localPhrases = {
  /* local abba is the same as default */
  abba: (internalFrame, numberOfMoves) => (internalFrame % numberOfMoves) + 1,
  accumulation: (() => {
    let movesThisRound = 1;
    let movesSoFar = 0;
    
    return (internalFrame, numberOfMoves) => {
                      
      if (movesSoFar === movesThisRound) {
        movesThisRound = (movesThisRound % numberOfMoves) + 1;
        movesSoFar = 0;
      }
      
      return ++movesSoFar;
      
    }
  })(),
  deceleration: (() => {
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
  })(),
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

exports.globalPhrases = {
  abba,
  accumulation,
  deceleration,
  retrograde,
  rondo
};

exports.localPhrases = localPhrases;