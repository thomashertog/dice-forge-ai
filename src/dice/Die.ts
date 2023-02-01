import { questionUntilValidAnswer, shuffle } from "../util";
import { DieFace } from "./faces/DieFace";

export class Die {
    faces: Array<DieFace>;

    constructor(...faces: Array<DieFace>) {
        this.faces = faces;
    }

    toString():string {
        return this.faces.map(face => face.toString()).join();
    }

    async replaceFace(bought: DieFace): Promise<void> {
        let dieFaceToReplace = 
            await questionUntilValidAnswer(
                `you bought ${bought}
                your die currently looks like this: ${this.faces.map(face => face.printWithCode())}
                which dieface you want to replace it with?`, ...this.faces.map(face => face.code));
        
        this.faces.splice(this.faces.findIndex(face => face.code === dieFaceToReplace.toUpperCase()), 1, bought);
        console.log(`new die: ${this.faces.map(face => face.toString())}`);
    }

    roll(): DieFace {
        shuffle(this.faces);
        return this.faces[0];
    }
}