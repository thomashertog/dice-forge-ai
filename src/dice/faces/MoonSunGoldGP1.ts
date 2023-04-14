import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { GoldenDieFace } from "./GoldenDieFace";

export class MoonSunGoldGP1 extends GoldenDieFace{
    
    constructor(){
        super('A1', 12);
    }

    toString(): string {
        return `${chalk.yellow(1)}+${chalk.blueBright(1)}+${chalk.red(1)}+${chalk.green(1)}`;
    }

    unstyledString(): string {
        return '1+1+1+1';
    }

    async resolve(game: Game, currentPlayer: Player, multiplier: number): Promise<void> {
        currentPlayer.addMoon(multiplier * 1);
        currentPlayer.addSun(multiplier * 1);
        currentPlayer.addGloryPoints(multiplier * 1);
        await this.resolveGold(game, currentPlayer, multiplier * 1);
    }
}