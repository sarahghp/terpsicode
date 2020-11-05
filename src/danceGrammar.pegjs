{
  
  const { commandTypes } = require('../../../../src/constants')

}

start =
  action / timing / phrasing / expression / reset

reset 
  = 'reset' { return { type: commandTypes.RESET }}
  
action 
  = odds:odds_expression? pre:prefix? mp:move_phrase { return { ...odds, ...pre, ...mp } }

prefix
  = item:(hold / phrasing / bare_expression) space { return item }

expression 
  = list_expression
  / bare_expression
  
list_expression
  = odds:odds_expression? expression:(bare_expression / list_phrase) space moves:move_phrase+ { return { ...odds, moves, ...expression } }
  
bare_expression 
  = phrase:('random' / 'scramble') { return { phrase, type: commandTypes.PHRASE }}
  
odds_expression
  = expression:('often' / 'sometimes') space { return { expression, type: commandTypes.EXPRESSION }}
  
phrasing 
  = phrase:('retrograde' / 'accumulation' / 'deceleration' / 'rondo') { return { phrase, type: commandTypes.PHRASE } }

list_phrase 
 = abba / coin_flip

abba 
 = phrase:('abba') { return { phrase, type: commandTypes.PHRASE } }
 
coin_flip 
  = phrase:('coin_flip') { return { phrase, type: commandTypes.COIN_FLIP } }
   
hold 
  = 'hold' space { return { time: 1 }}

timing 
  = time:timing_phrases { return { time, type: commandTypes.TIMING } }
  
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
  = space? amount:(number/'all') space move:move space? { return { amount, move, type: commandTypes.MOVE }}
  
move 
  = ! reserved_words move:text { return move.toLowerCase() }
  
reserved_words =
  'all' / 'reset'
  / 'speed' / 'sustain' / 'sudden' / 'hold' / 'staccato'
  / 'retrograde' / 'accumulation' / 'deceleration' / 'abba' / 'rondo' 
  / 'random' / 'often' / 'sometimes' / 'coin_flip' / 'every' / 'scramble'

text              
  = text:[a-zA-Z0-9-._]+ space { return text.join(''); }

space 
  = [ \n]* / !.
    
number
  = digits:[0-9.]+ { return +(digits.join(''));  }