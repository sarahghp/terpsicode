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

let previousCommands = [];
let readCommands;

const parseInput = (command) => {
  try {
    console.log(command);
    chomp(parser.parse(command));
  } catch (err) {
    console.error(`The parser did not understand the command:`, command)
    console.error(err);
  }
};

const readCommandsInit = () => {
  
  const storedCommands = JSON.parse(localStorage.getItem('previousCommands'));
  
  if (previousCommands.length === 0 && !storedCommands) {
    return '';
  }
  
  if (previousCommands.length === 0) {
    previousCommands = storedCommands;
  }
  
  let counter = previousCommands.length;
  
  return (direction) => {
    counter = counter + direction;
    const command = previousCommands[counter];
    return command || '';
  };
};

const saveAndClearValue = (input, command) => {
  const { localStorage } = window;  
  previousCommands.push(command);
  input.value = '';
  localStorage.setItem('previousCommands', JSON.stringify(previousCommands));
};

const postValue = (value) => {
  const para = document.createElement('p');
  const text = document.createTextNode(value);
  para.appendChild(text);
  document.getElementById('commands').appendChild(para);
};

const submitMove = (input) => ({ keyCode, target: { value } }) => {
  if (keyCode === 13) { // enter
    readCommands = readCommandsInit(); // reset the command reader
    saveAndClearValue(input, value);
    parseInput(value);
    postValue(value);
    return;
  };
  
  if (keyCode === 38) { // up arrow
    input.value = readCommands(-1);
  }
  
  if (keyCode === 40) { // down arrow
    input.value = readCommands(1);
  }

  return; 
};

const init = () => {
  const input = document.getElementById('input-field');
  input.addEventListener('keydown', submitMove(input));
  startYourEngines(moveCounts);
  readCommands = readCommandsInit();
};

document.addEventListener('DOMContentLoaded', init);
