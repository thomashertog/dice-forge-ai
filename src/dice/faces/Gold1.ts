import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { GoldenDieFace } from "./GoldenDieFace";

export class Gold1 extends GoldenDieFace {

    constructor() {
        super('G1');
    }

    toString(): string {
        return `${chalk.yellow(1)}`;
    }

    unstyledString(): string {
        return '1';
    }

    async resolve(game: Game, currentPlayer: Player, multiplier: number): Promise<void> {
        const value = 1 * multiplier;

        await this.resolveGold(game, currentPlayer, value);
    }
}