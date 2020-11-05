const { parser } = require('./createParser');

describe('parser expressions', () => {
  
  describe('moves', () => {
    it('parses a number of moves correctly', () => {
      expect(parser.parse('3 walk')).toMatchObject({
        amount: 3,
        move: 'walk',
        type: 'MOVE'
      });
    });
    
    it('parses a call for all  moves correctly', () => {
      expect(parser.parse('all walk')).toMatchObject({
        amount: 'all', 
        move: 'walk',
        type: 'MOVE'
      });
    });
  });
  
  describe('timings', () => {
    it('parses speed correctly', () => {
      expect(parser.parse('speed 1')).toMatchObject({
        time: 1, 
        type: 'TIMING'
      });
      
      expect(parser.parse('speed 40')).toMatchObject({
        time: 40, 
        type: 'TIMING'
      });
      
      expect(parser.parse('speed 0')).toMatchObject({
        time: 0, 
        type: 'TIMING'
      });
      
      expect(parser.parse('speed 0.3')).toMatchObject({
        time: 0.3, 
        type: 'TIMING'
      });
    });
    
    it('parses special timings correctly', () => {
      
      expect(parser.parse('staccato')).toMatchObject({
        time: 1, 
        type: 'TIMING'
      });
      
      expect(parser.parse('sudden')).toMatchObject({
        time: 0.5, 
        type: 'TIMING'
      });
            
      expect(parser.parse('sustain')).toMatchObject({
        time: 5, 
        type: 'TIMING'
      });
    });
  });
  
  describe('phrasings', () => {
    it('parses a phrasing without a move correctly', () => {
      expect(parser.parse('accumulation')).toMatchObject({
        phrase: 'accumulation',
        type: 'PHRASE',
      });
    });
    
    it('parses a phrasing with a move correctly', () => {
      expect(parser.parse('accumulation 5 lunge')).toMatchObject({
        phrase: 'accumulation',
        amount: 5, 
        move: 'lunge',
        type: 'MOVE',
      });
    });
  });
  
  describe('expressions', () => {
    it('it works with phrase type expressions without arguments', () => {
      expect(parser.parse('random')).toMatchObject({
        phrase: 'random', 
        type: 'PHRASE'
      });
    });
    
    it('it works with phrase type expressions with arguments', () => {
      expect(parser.parse('abba 1 walk 1 lunge')).toMatchObject({
        phrase: 'abba', 
        type: 'PHRASE',
        moves: [{
          amount: 1, 
          move: 'walk',
          type: 'MOVE'
        },
        {
          amount: 1, 
          move: 'lunge',
          type: 'MOVE'
        }]
      });
    });
    
    it('it works with expression type expressions with move arguments', () => {
      expect(parser.parse('often 3 walk')).toMatchObject({
        expression: 'often', 
        amount: 3, 
        move: 'walk',
        type: 'MOVE'
      });
    });
    
    it('it works with expression type expressions with move and phrase arguments', () => {
      expect(parser.parse('often retrograde 3 walk')).toMatchObject({
        expression: 'often', 
        amount: 3, 
        move: 'walk',
        type: 'MOVE',
        phrase: 'retrograde',
      });
    });
    
    it('it works with a list expression', () => {
      expect(parser.parse('coin_flip 3 walk 2 lunge')).toMatchObject({ 
        moves:
         [ { amount: 3, move: 'walk', type: 'MOVE' },
           { amount: 2, move: 'lunge', type: 'MOVE' } ],
        phrase: 'coin_flip',
        type: 'COIN_FLIP' 
      });
    });
    
    it('it works with a list and odds expression', () => {
      expect(parser.parse('sometimes coin_flip 3 walk 2 lunge')).toMatchObject({ 
        expression: 'sometimes',
        moves:
         [ { amount: 3, move: 'walk', type: 'MOVE' },
           { amount: 2, move: 'lunge', type: 'MOVE' } ],
        phrase: 'coin_flip',
        type: 'COIN_FLIP' 
      });
    });
  });
});