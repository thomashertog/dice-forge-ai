#!/usr/bin/env node
import chalk from 'chalk';
import { clear } from 'console';
import figlet from 'figlet';
import { exit } from 'process';
import { Game } from './Game';
import { questionUntilValidAnswer } from './util';

clear();
console.log(chalk.green(figlet.textSync('dice-forge', { horizontalLayout: 'full'})));

questionUntilValidAnswer("How many people you want to play with? (2..4)", "2", "3", "4").then(playerCount => new Game(parseInt(playerCount)).start());

exit;