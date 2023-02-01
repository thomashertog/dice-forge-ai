import chalk from 'chalk';
import { DieFace } from './faces/DieFace';

export class DieFacePool{

    dieFaces : DieFace[];
    cost: number;

    constructor(cost: number, faces: DieFace[]){
        this.cost = cost;
        this.dieFaces = faces;
    }

    addDieFace(face: DieFace):void{
        this.dieFaces.push(face);
    }

    toString():string {
        return `${chalk.yellow(this.cost)}: ${this.dieFaces}`;
    }
}