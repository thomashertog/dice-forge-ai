import chalk from "chalk";
import { Player } from "../../Player";
import { CommandLineInterface } from "../../interfaces/cli";
import { Game } from "../../game";
import { fn } from "../../util";
import { GoldenDieFace } from "./GoldenDieFace";

export class PickGoldMoonSun1 extends GoldenDieFace{
    
    constructor(){
        super('P1', 4);
    }

    toString(): string {
        return `${chalk.yellow(1)}/${chalk.blueBright(1)}/${chalk.red(1)}`;
    }

    unstyledString(): string {
        return '1/1/1';
    }

    async resolve(game: Game, currentPlayer: Player, multiplier: number): Promise<void> {
        const value = multiplier * 1;
        
        const resource = 
        (await currentPlayer.getUserInterface().chooseResource(game, currentPlayer.name, value, 'G', 'M', 'S')).toUpperCase();

        if (resource === 'G') {
            await this.resolveGold(game, currentPlayer, value);
        } else if (resource === 'M') {
            currentPlayer.addMoon(value);
        } else if (resource === 'S') {
            currentPlayer.addSun(value);
        }
    }

    hasChoice(): boolean {
        return true;
    }
}