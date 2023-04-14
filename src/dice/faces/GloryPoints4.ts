import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { DieFace } from "./DieFace";

export class GloryPoints4 extends DieFace {

    constructor() {
        super('GP4', 12);
    }

    toString(): string {
        return `${chalk.green(4)}`;
    }

    unstyledString(): string {
        return '4';
    }

    resolve(game: Game, currentPlayer: Player, multiplier: number): void {
        currentPlayer.addMoon(multiplier * 4);
    }
}