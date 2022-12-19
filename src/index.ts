#!/usr/bin/env node
import { Game } from './game';
import { clear } from 'console';
import figlet from 'figlet';
import chalk from 'chalk';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

clear();
console.log(chalk.green(figlet.textSync('dice-forge', { horizontalLayout: 'full'})));

const rl = readline.createInterface({input, output})
const game = new Game();

rl.question("How many people you want to play with?", game.start);