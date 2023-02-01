import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class MoonSunGoldGP1 extends DieFace{
    
    constructor(){
        super('A1');
    }

    toString(): string {
        return `${chalk.yellow(1)}+${chalk.blue(1)}+${chalk.red(1)}+${chalk.green(1)}`;
    }

    async resolve(currentPlayer: Player, multiplier: number): Promise<void> {
        currentPlayer.addMoon(multiplier * 1);
        currentPlayer.addSun(multiplier * 1);
        currentPlayer.addGloryPoints(multiplier * 1);
        await currentPlayer.addGold(multiplier * 1);
    }
    
}