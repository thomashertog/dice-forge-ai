import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class Helmet extends DieFace{
    
    constructor(){
        super('H');
    }

    toString(): string {
        return `${chalk.bgBlackBright.black('x3')}`;
    }

    unstyledString(): string {
        return 'x3';
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        //nothing to do here, helmet can't be resolved on its own
    }
    
}