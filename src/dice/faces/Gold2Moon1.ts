import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { GoldenDieFace } from "./GoldenDieFace";

export class Gold2Moon1 extends GoldenDieFace {
    
    constructor(){
        super('G2M1', 4);
    }

    toString(): string {
        return `${chalk.yellow(2)}+${chalk.blueBright(1)}`;
    }

    unstyledString(): string {
        return '2+1';
    }

    async resolve(game: Game, currentPlayer: Player, multiplier: number): Promise<void> {
        currentPlayer.addMoon(multiplier * 1);
        await this.resolveGold(game, currentPlayer, multiplier * 2);
    }
}