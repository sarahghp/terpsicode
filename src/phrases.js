const accumulation = () => {
  let round = 0;
  let display;

  return (currentFnIndex, imageDisplayFns) => {
        
    if (currentFnIndex == 0) { // a new round has started
      display = imageDisplayFns.slice(0, round + 1);
      round = ++round % imageDisplayFns.length;
    }
    
    return display|| imageDisplayFns;
    
  }
}

const retrograde = () => (currentFnIndex, imageDisplayFns) => {
  return [...imageDisplayFns].reverse();
}

exports.phrases = {
  accumulation,
  retrograde
}