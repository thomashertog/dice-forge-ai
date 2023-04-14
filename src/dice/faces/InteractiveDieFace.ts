import { fn } from "../../util";
import { DieFace } from "./DieFace";

export abstract class InteractiveDieFace extends DieFace{

    constructor(code: string, cost: number = 0){
        super(code, cost);
    }

    resolveAfterInteraction(callbacks: Map<fn, number>): void{
        callbacks.forEach((value, callback) => {callback(value)});
    }
}