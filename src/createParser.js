/*
  
  This file generates the parser.
  
*/

const { readFileSync } = require('fs');
const { join } = require('path');
const { generate } = require('pegjs');

/* Read grammar file */
const grammarFilePath = join(__dirname + '/danceGrammar.pegjs');
const grammar = readFileSync(grammarFilePath).toString();

/* Run parser */
const parser = generate(grammar);

console.log(parser.parse('accumulation 5 lunge'));
console.log(parser.parse('sometimes abba 2 walk 2 run'));
console.log(parser.parse('often retrograde 2 jump'));
console.log(parser.parse('sometimes coin_flip 3 walk 2 lunge'));


exports.parser = parser;
