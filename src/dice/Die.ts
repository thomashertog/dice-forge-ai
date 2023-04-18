import { Game } from "../game";
import { getRandomElementOfArray } from "../util";
import { DieFace } from "./faces/DieFace";

export class Die {
    faces: Array<DieFace>;

    constructor(...faces: Array<DieFace>) {
        this.faces = faces;
    }

    toString():string {
        return this.faces.map(face => face.toString()).join();
    }

    replaceFace(faceToReplace: DieFace, replacement: DieFace, game: Game):void {
        this.faces.splice(this.faces.findIndex(face => face.is(faceToReplace.code)), 1, replacement);
    }

    roll(): DieFace {
        getRandomElementOfArray(this.faces);
        return this.faces[0];
    }
}