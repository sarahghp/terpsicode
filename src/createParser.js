/*
  
  This file generates the parser used in performance.
  It should only need to be run when the parser changes,
  such as when new capabilities are added.
  
  It can be run with the make-parser script: npm run make-parser.
  
*/

const { readFileSync } = require('fs');
const { join } = require('path');
const { generate } = require('pegjs');

/* Read grammar file */
const grammarFilePath = join(__dirname + '/danceGrammar.pegjs');
const grammar = readFileSync(grammarFilePath).toString();

console.log('hi from parser');

/* Run parser */
const parser = generate(grammar);

console.log(parser.parse('all walk'));
console.log(parser.parse('speed 3'));
console.log(parser.parse('sustain'));