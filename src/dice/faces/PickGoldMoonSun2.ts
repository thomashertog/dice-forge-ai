import chalk from "chalk";
import { Player } from "../../Player";
import { CommandLineInterface } from "../../cli";
import { Game } from "../../game";
import { GoldenDieFace } from "./GoldenDieFace";

export class PickGoldMoonSun2 extends GoldenDieFace{
    
    constructor(){
        super('P2', 12);
    }

    toString(): string {
        return `${chalk.yellow(2)}/${chalk.blueBright(2)}/${chalk.red(2)}`;
    }

    unstyledString(): string {
        return '2/2/2';
    }

    async resolve(game: Game, currentPlayer: Player, multiplier: number): Promise<void> {
        const value = multiplier * 2;
        
        const resource = 
        (await new CommandLineInterface().chooseResource(game, currentPlayer.name, value, 'G', 'M', 'S')).toUpperCase();
                
        if (resource === 'G') {
            await this.resolveGold(game, currentPlayer, multiplier * 2);
        } else if (resource === 'M') {
            currentPlayer.addMoon(multiplier * 2);
        } else if (resource === 'S') {
            currentPlayer.addSun(multiplier * 2);
        }
    }
 
    hasChoice(): boolean {
        return true;
    }
}