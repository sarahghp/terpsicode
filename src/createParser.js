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

exports.parser = parser;
