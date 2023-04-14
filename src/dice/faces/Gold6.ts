import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { GoldenDieFace } from "./GoldenDieFace";

export class Gold6 extends GoldenDieFace{
    
    constructor(){
        super('G6', 4);
    }

    toString(): string {
        return `${chalk.yellow(6)}`;
    }

    unstyledString(): string {
        return '6';
    }

    async resolve(game: Game, currentPlayer: Player, multiplier: number): Promise<void> {
        await this.resolveGold(game, currentPlayer, multiplier * 6);
    }
}