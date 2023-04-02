#!/usr/bin/env node
import chalk from 'chalk';
import { clear } from 'console';
import figlet from 'figlet';
import { exit } from 'process';
import { Game } from './game';
import { questionUntilValidAnswer } from './util';

clear();
console.log(chalk.green(figlet.textSync('dice-forge', { horizontalLayout: 'full' })));

let game: Game;

questionUntilValidAnswer(null, "How many people you want to play with? (2..4)", "2", "3", "4").then(playerCount => {
    game = new Game(parseInt(playerCount));
    game.start()
});

exit;