import chalk from "chalk";
import { Player } from "../../Player";
import { CommandLineInterface } from "../../interfaces/cli";
import { Game } from "../../game";
import { GoldenDieFace } from "./GoldenDieFace";

export class PickGold3GP2 extends GoldenDieFace {

    constructor() {
        super('P3', 5);
    }

    toString(): string {
        return `${chalk.yellow(3)}/${chalk.green(2)}`;
    }

    unstyledString(): string {
        return '3/2';
    }

    async resolve(game: Game, currentPlayer: Player, multiplier: number): Promise<void> {
        
        const resource = (await currentPlayer.getUserInterface().chooseResource(game, currentPlayer.name, null, 'G', 'P')).toUpperCase();

        if (resource === 'G') {
            await this.resolveGold(game, currentPlayer, multiplier * 3)
        } else if (resource === 'P') {
            currentPlayer.addGloryPoints(multiplier * 2);
        }
    }

    hasChoice(): boolean {
        return true;
    }
}