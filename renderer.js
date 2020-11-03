const { readdirSync } = require('fs');
const { parser } = require('./src/createParser');

const moveCounts = readdirSync('./tagged').map((move) => {
  return { move, length: readdirSync(`./tagged/${move}`).length}
});


const parseInput = (command) => {
  console.log('hi');
  console.log(command);
  console.log(parser.parse(command));
}

const clearValue = (input) => {
  input.value = '';
}

const postValue = (value) => {
  const para = document.createElement('p');
  const text = document.createTextNode(value);
  para.appendChild(text);
  document.getElementById('commands').appendChild(para);
}

const submitMove = (parser, moveCounts, input) => ({ keyCode, target: { value } }) => {
  if (keyCode === 13) { // enter
    parseInput(value);
    clearValue(input);
    postValue(value);
    return;
  }
  
  return; 
}

const init = () => {
  const input = document.getElementById('input-field');
  input.addEventListener('keydown', submitMove(parser, moveCounts, input));
}

document.addEventListener('DOMContentLoaded', init);
