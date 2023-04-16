#!/usr/bin/env node
import chalk from 'chalk';
import { clear } from 'console';
import figlet from 'figlet';
import { exit } from 'process';
import { Game } from './game';
import { CommandLineInterface } from './interfaces/cli';

clear();
console.log(chalk.green(figlet.textSync('dice-forge', { horizontalLayout: 'full' })));

let game: Game;

new CommandLineInterface().getPlayerCount().then(count => {
    game = new Game(count);
    game.start();
});

exit;