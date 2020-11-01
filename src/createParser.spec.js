const { parser } = require('./createParser');

describe('parser exppressions', () => {
  
  describe('timings', () => {
    it('parses speed correctly', () => {
      expect(parser.parse('speed 1')).toMatchObject({
        amount: 1, 
        type: 'TIMING'
      });
      
      expect(parser.parse('speed 40')).toMatchObject({
        amount: 40, 
        type: 'TIMING'
      });
      
      expect(parser.parse('speed 0')).toMatchObject({
        amount: 0, 
        type: 'TIMING'
      });
      
      expect(parser.parse('speed 0.3')).toMatchObject({
        amount: 0.3, 
        type: 'TIMING'
      });
    });
    
    it('parses special timings correctly', () => {
      
      expect(parser.parse('staccato')).toMatchObject({
        amount: 1, 
        type: 'TIMING'
      });
      
      expect(parser.parse('sudden')).toMatchObject({
        amount: 0.5, 
        type: 'TIMING'
      });
            
      expect(parser.parse('sustain')).toMatchObject({
        amount: 5, 
        type: 'TIMING'
      });
    });
  });
  

  
});