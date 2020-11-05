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

const random = () => (currentFnIndex, imageDisplayFns) => { 
  const idx = Math.floor(Math.random() * imageDisplayFns.length);
  const imageCopy = [...imageDisplayFns]
   imageCopy[currentFnIndex] = imageDisplayFns[idx];
   return imageCopy;
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
};

const scrambleEm = (arr) => {
  return arr.reduce((acc, val) => {
    const pos = Math.floor(Math.random() * acc.length);
    acc.splice(pos, 0, val);
    return acc;
  } , [])  
}

const scramble = () => {
  let scram;
  
  return (currentFnIndex, imageDisplayFns) => {
    if (currentFnIndex === 0) {
      scram = scrambleEm(imageDisplayFns);
    }
    
    return scram || imageDisplayFns;
   
  }
}

const localPhrases = {
  /* local abba is the same as default */
  abba: () => (internalFrame, numberOfMoves) => (internalFrame % numberOfMoves) + 1,
  accumulation: () => {
    let movesThisRound = 1;
    let movesSoFar = 0;
    
    return (internalFrame, numberOfMoves) => {
                      
      if (movesSoFar === movesThisRound) {
        movesThisRound = (movesThisRound % numberOfMoves) + 1;
        movesSoFar = 0;
      }
      
      return ++movesSoFar;
      
    }
  },
  deceleration: () => {
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
  },
  default: () => (internalFrame, numberOfMoves) => (internalFrame % numberOfMoves) + 1,
  random: () => (internalFrame, numberOfMoves) => Math.ceil(Math.random() * numberOfMoves),
  retrograde: () => (internalFrame, numberOfMoves) => numberOfMoves - (internalFrame % numberOfMoves),
  rondo: () => {
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
  },
  scramble: () => {
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
  },

}

exports.globalPhrases = {
  abba,
  accumulation,
  deceleration,
  retrograde,
  random,
  rondo,
  scramble,
};

exports.localPhrases = localPhrases;