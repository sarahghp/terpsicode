const { parser } = require('./createParser');
const { commandTypes } = require('./constants')

describe('parser expressions', () => {
  
  describe('moves', () => {
    it('parses a number of moves correctly', () => {
      expect(parser.parse('3 walk')).toMatchObject({
        amount: 3,
        move: 'walk',
        type: commandTypes.MOVE
      });
    });
    
    it('parses a call for all  moves correctly', () => {
      expect(parser.parse('all walk')).toMatchObject({
        amount: 'all', 
        move: 'walk',
        type: commandTypes.MOVE
      });
    });
  });
  
  describe('timings', () => {
    it('parses speed correctly', () => {
      expect(parser.parse('speed 1')).toMatchObject({
        time: 1, 
        type: commandTypes.TIMING
      });
      
      expect(parser.parse('speed 40')).toMatchObject({
        time: 40, 
        type: commandTypes.TIMING
      });
      
      expect(parser.parse('speed 0')).toMatchObject({
        time: 0, 
        type: commandTypes.TIMING
      });
      
      expect(parser.parse('speed 0.3')).toMatchObject({
        time: 0.3, 
        type: commandTypes.TIMING
      });
    });
    
    it('parses special timings correctly', () => {
      
      expect(parser.parse('staccato')).toMatchObject({
        time: 1, 
        type: commandTypes.TIMING
      });
      
      expect(parser.parse('sudden')).toMatchObject({
        time: 0.5, 
        type: commandTypes.TIMING
      });
            
      expect(parser.parse('sustain')).toMatchObject({
        time: 5, 
        type: commandTypes.TIMING
      });
    });
  });
  
  describe('phrasings', () => {
    it('parses a phrasing without a move correctly', () => {
      expect(parser.parse('accumulation')).toMatchObject({
        phrase: 'accumulation',
        type: commandTypes.PHRASE,
      });
    });
    
    it('parses a phrasing with a move correctly', () => {
      expect(parser.parse('accumulation 5 lunge')).toMatchObject({
        phrase: 'accumulation',
        amount: 5, 
        move: 'lunge',
        type: commandTypes.MOVE,
      });
    });
  });
  
  describe('expressions', () => {
    it('it works with phrase type expressions without arguments', () => {
      expect(parser.parse('random')).toMatchObject({
        phrase: 'random', 
        type: commandTypes.PHRASE
      });
    });
    
    it('it works with phrase type expressions with arguments', () => {
      expect(parser.parse('abba 1 walk 1 lunge')).toMatchObject({
        phrase: 'abba', 
        type: commandTypes.PHRASE,
        moves: [{
          amount: 1, 
          move: 'walk',
          type: commandTypes.MOVE
        },
        {
          amount: 1, 
          move: 'lunge',
          type: commandTypes.MOVE
        }]
      });
    });
    
    it('it works with expression type expressions with move arguments', () => {
      expect(parser.parse('often 3 walk')).toMatchObject({
        expression: 'often', 
        amount: 3, 
        move: 'walk',
        type: commandTypes.MOVE
      });
    });
    
    it('it works with expression type expressions with move and phrase arguments', () => {
      expect(parser.parse('often retrograde 3 walk')).toMatchObject({
        expression: 'often', 
        amount: 3, 
        move: 'walk',
        type: commandTypes.MOVE,
        phrase: 'retrograde',
      });
    });
    
    it('it works with a list expression', () => {
      expect(parser.parse('coin_flip 3 walk 2 lunge')).toMatchObject({ 
        moves:
         [ { amount: 3, move: 'walk', type: commandTypes.MOVE },
           { amount: 2, move: 'lunge', type: commandTypes.MOVE } ],
        phrase: 'coin_flip',
        type: commandTypes.COIN_FLIP 
      });
    });
    
    it('it works with a list and odds expression', () => {
      expect(parser.parse('sometimes coin_flip 3 walk 2 lunge')).toMatchObject({ 
        expression: 'sometimes',
        moves:
         [ { amount: 3, move: 'walk', type: commandTypes.MOVE },
           { amount: 2, move: 'lunge', type: commandTypes.MOVE } ],
        phrase: 'coin_flip',
        type: commandTypes.COIN_FLIP 
      });
    });
  });
});