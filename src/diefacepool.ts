import { DieFaceOption } from './diefaceoption';

export class DieFacePool{

    dieFaces : DieFaceOption[];
    cost: number;

    constructor(cost: number, faces: DieFaceOption[]){
        this.cost = cost;
        this.dieFaces = faces;
    }

    addDieFace(face: DieFaceOption):void{
        this.dieFaces.push(face);
    }
}