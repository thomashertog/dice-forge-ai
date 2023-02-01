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
        let result = `${chalk.yellow(this.cost)}:\t`;
        result += this.dieFaces.map(face => `${face.toString()}; `)
        return result;
    }
}