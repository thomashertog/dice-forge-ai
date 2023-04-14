import { Player } from '../../Player';
import { Game } from '../../game';
import { Helmet } from './Helmet';
import { Mirror } from './Mirror';

export abstract class DieFace{
    code: string;
    cost: number

    constructor(code: string, cost: number = 0) {
        this.code = code;
        this.cost = cost;
    }

    abstract toString(): string;

    abstract unstyledString(): string;

    printWithCode(): string{
        return `${this.toString()} (${this.code})`;
    }

    abstract resolve(game: Game, currentPlayer: Player, multiplier: number): void;

    isAffordableFor(player: Player): boolean {
        return player.gold >= this.cost;    
    }
    
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