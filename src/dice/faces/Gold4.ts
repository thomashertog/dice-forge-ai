import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { GoldenDieFace } from "./GoldenDieFace";

export class Gold4 extends GoldenDieFace{
    
    constructor(){
        super('G4', 3);
    }

    toString(): string {
        return `${chalk.yellow(4)}`;
    }

    unstyledString(): string {
        return '4';
    }

    async resolve(game: Game, currentPlayer: Player, multiplier: number): Promise<void> {
        await this.resolveGold(game, currentPlayer, multiplier * 4);
    }
}