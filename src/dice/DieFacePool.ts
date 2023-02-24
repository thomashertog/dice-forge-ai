import chalk from 'chalk';
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
        return `${chalk.yellow(this.cost)}: ${this.dieFaces}`;
    }

    removeDieFace(face: BuyableDieFace): void {
        this.dieFaces.splice(this.dieFaces.findIndex(dieFace => dieFace.is(face.code)), 1);
    }
}