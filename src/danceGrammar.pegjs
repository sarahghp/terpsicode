start =
  action / timing
  
action 
  = amount:(number/'all') space move:move { return { amount, move, type: 'MOVE' } }

timing 
  = amount:timing_phrases { return { amount, type: 'TIMING' } }
  
timing_phrases
  = speed / staccato / sudden / sustain
  
speed 
  = 'speed' space amount:number { return amount }

staccato
 = 'staccato' { return 1 }

sudden 
  = 'sudden' { return 0.5 }

sustain 
  = 'sustain' { return 5 }
  
move 
  = ! reserved_words move:text { return move }
  
reserved_words =
  'all' 
  / 'speed' / 'sustain' / 'sudden' / 'hold' / 'staccato'
  / 'retrograde' / 'accumulation' / 'deceleration' / 'abba' / 'rondo' 
  / 'random' / 'often' / 'sometimes' / 'coin_flip' / 'every' / 'scramble'

text              
  = text:[a-zA-Z0-9-._]+ space { return text.join(''); }

space 
  = [ \n]* / !.
    
number
  = digits:[0-9]+ { return +(digits.join(''));  }