import chalk from 'chalk';
import { RIGHT_PADDING_LENGTH, toPaddedString } from '../util';
import { BuyableDieFace } from './faces/BuyableDieFace';

export class DieFacePool {

    dieFaces: Array<BuyableDieFace>;
    cost: number;

    constructor(cost: number, faces: Array<BuyableDieFace>) {
        this.cost = cost;
        this.dieFaces = faces;
    }

    addDieFace(face: BuyableDieFace): void {
        this.dieFaces.push(face);
    }

    toString(): string {
        return `${chalk.yellow(this.cost)}: ${toPaddedString(this.dieFaces, RIGHT_PADDING_LENGTH - `${this.cost}: `.length)}`;
    }

    removeDieFace(face: BuyableDieFace): void {
        this.dieFaces.splice(this.dieFaces.findIndex(dieFace => dieFace.is(face.code)), 1);
    }
}