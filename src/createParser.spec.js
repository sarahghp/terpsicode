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
    
    it('parses a hold move correctly', () => {
      expect(parser.parse('hold 1 lunge')).toMatchObject({
        amount: 1, 
        move: 'lunge',
        type: 'MOVE',
        time: 1,
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
    describe('it works with phrase type expressions without arguments', () => {
      expect(parser.parse('random')).toMatchObject({
        phrase: 'random', 
        type: 'PHRASE'
      });
    });
    
    describe('it works with a list expression of phrase type', () => {
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
    
  });
  
});