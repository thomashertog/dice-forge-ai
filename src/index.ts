#!/usr/bin/env node
import { Game } from './game';
import { clear } from 'console';
import figlet from 'figlet';
import chalk from 'chalk';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import { questionUntilValidAnswer } from './util';

clear();
console.log(chalk.green(figlet.textSync('dice-forge', { horizontalLayout: 'full'})));

const rl = readline.createInterface({input, output})
const game = new Game();

questionUntilValidAnswer("How many people you want to play with? (2..4)", "2", "3", "4").then(playerCount => game.start(playerCount));