import chalk from 'chalk';
import { RIGHT_PADDING_LENGTH, toPaddedString } from '../util';
import { DieFace } from './faces/DieFace';

export class DieFacePool {

    dieFaces: Array<DieFace>;
    cost: number;

    constructor(cost: number, faces: Array<DieFace>) {
        this.cost = cost;
        this.dieFaces = faces;
    }

    addDieFace(face: DieFace): void {
        this.dieFaces.push(face);
    }

    toString(): string {
        return `${chalk.yellow(this.cost)}: ${toPaddedString(this.dieFaces, RIGHT_PADDING_LENGTH - `${this.cost}: `.length)}`;
    }

    removeDieFace(face: DieFace): void {
        this.dieFaces.splice(this.dieFaces.findIndex(dieFace => dieFace.is(face.code)), 1);
    }
}