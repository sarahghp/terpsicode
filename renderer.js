const { existsSync, lstatSync, readdirSync } = require('fs');
const { parser } = require('./src/createParser');
const { chomp, startYourEngines } = require('./src/loop');
const { getMovePath } = require('./src/utils');

const isDir = (path) => {
  return existsSync(path) && lstatSync(path).isDirectory();
};

const moveCounts = readdirSync('./tagged').map((move) => {
  const movePath = getMovePath(move);
  if (!isDir(movePath)) {
    return;
  }

  return { move, size: readdirSync(movePath).length}
});

console.log(moveCounts);

let previousCommands = [];

const parseInput = (command) => {
  console.log(command);
  console.log(parser.parse(command));
  chomp(parser.parse(command))
}

const saveAndClearValue = (input, command) => {
  previousCommands.push(command);
  input.value = '';
}

const postValue = (value) => {
  const para = document.createElement('p');
  const text = document.createTextNode(value);
  para.appendChild(text);
  document.getElementById('commands').appendChild(para);
}

const submitMove = (input) => ({ keyCode, target: { value } }) => {
  if (keyCode === 13) { // enter
    saveAndClearValue(input, value);
    parseInput(value);
    postValue(value);
    return;
  }
  
  if (keyCode === 38) { // up key
    input.value = previousCommands.pop();
  }
  
  return; 
}

const init = () => {
  const input = document.getElementById('input-field');
  input.addEventListener('keydown', submitMove(input));
  startYourEngines(moveCounts);
}

document.addEventListener('DOMContentLoaded', init);
