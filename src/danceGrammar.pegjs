start =
  action / timing / phrasing / expression
  
action 
  = pre:prefix? mp:move_phrase { return { ...pre,  ...mp } }

prefix
  = item:(hold / phrasing) space { return item }

expression 
  = list_expression
  / bare_expression
  
list_expression
  = expression:(bare_expression / odds_expression) space move:move_phrase+ { return { move, ...expression } }
  
bare_expression 
  = expression:('random' / 'scramble') { return { expression, type: 'EXPRESSION' }}
  
odds_expression
  = expression:('often' / 'sometimes' / 'coin_flip') { return { expression, type: 'EXPRESSION' }}
  
phrasing 
  = phrase:('retrograde' / 'accumulation' / 'deceleration' / 'abba' / 'rondo') { return { phrase, type: 'PHRASE' } }
  
hold 
  = 'hold' space { return { time: 1 }}

timing 
  = time:timing_phrases { return { time, type: 'TIMING' } }
  
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

move_phrase 
  = space? amount:(number/'all') space move:move space? { return { amount, move, type: 'MOVE' }}
  
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
  = digits:[0-9.]+ { return +(digits.join(''));  }