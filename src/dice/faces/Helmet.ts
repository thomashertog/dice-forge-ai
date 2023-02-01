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

    resolveRoll(currentPlayer: Player, multiplier: number): void {
        //TODO
    }
    
}