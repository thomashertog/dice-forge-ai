import { Player } from '../../Player';
import { Helmet } from './Helmet';
import { Mirror } from './Mirror';

export abstract class DieFace{
    code: string;

    constructor(code: string) {
        this.code = code;
    }

    abstract toString(): string;

    abstract unstyledString(): string;

    printWithCode(): string{
        return `${this.toString()} (${this.code})`;
    }

    abstract resolve(currentPlayer: Player, multiplier
        : number): void;

    static isMirror(face: DieFace): face is Mirror {
        return (face as Mirror).code === 'M';
    }

    static isHelmet(face: DieFace): face is Helmet{
        return (face as Helmet).code === 'H';
    }

    hasChoice(): boolean{
        return false;
    }

    is(code: string):boolean{
        return this.code === code;
    }
}