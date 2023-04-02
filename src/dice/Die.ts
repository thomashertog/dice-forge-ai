import { Game } from "../game";
import { chooseDieFace, shuffle } from "../util";
import { DieFace } from "./faces/DieFace";

export class Die {
    faces: Array<DieFace>;

    constructor(...faces: Array<DieFace>) {
        this.faces = faces;
    }

    toString():string {
        return this.faces.map(face => face.toString()).join();
    }

    async replaceFace(bought: DieFace, game: Game): Promise<void> {
        let dieFaceToReplace = await chooseDieFace(this.faces, game);
        
        this.faces.splice(this.faces.findIndex(face => face.is(dieFaceToReplace.code)), 1, bought);
    }

    roll(): DieFace {
        shuffle(this.faces);
        return this.faces[0];
    }
}