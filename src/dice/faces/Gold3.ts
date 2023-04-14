import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { GoldenDieFace } from "./GoldenDieFace";

export class Gold3 extends GoldenDieFace{
    
    constructor(){
        super('G3', 2);
    }

    toString(): string {
        return `${chalk.yellow(3)}`;
    }
    
    unstyledString(): string {
        return '3';
    }
    
    async resolve(game: Game, currentPlayer: Player, multiplier: number): Promise<void> {
        await this.resolveGold(game, currentPlayer, multiplier * 3);
    }
}