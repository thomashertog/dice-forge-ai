import { DieFaceOption, printDieFaceOption } from "./diefaceoption";
import { getArrayOfNumberStringsUpTo, questionUntilValidAnswer, shuffle } from "./util";

export class Die {
    faces: Array<DieFaceOption>;

    constructor(...faces: Array<DieFaceOption>) {
        this.faces = faces;
    }

    toString = () => {
        return this.faces.map(option => printDieFaceOption(option));
    }

    async replaceFace(bought: DieFaceOption): Promise<void> {
        let dieFaceToReplace = parseInt(await questionUntilValidAnswer("which dieface you want to replace it with? (1..6)", ...getArrayOfNumberStringsUpTo(6)));
        
        this.faces[dieFaceToReplace - 1] = bought;
        console.log(`new die: ${this.faces.map(face => printDieFaceOption(face))}`);
    }

    roll(): DieFaceOption {
        shuffle(this.faces);
        return this.faces[0];
    }
}