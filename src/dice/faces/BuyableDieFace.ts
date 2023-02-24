import { Buyable } from '../../Buyable'
import { Player } from '../../Player';
import { DieFace } from './DieFace';

export abstract class BuyableDieFace extends DieFace implements Buyable{

    abstract getCost(): number;

    isAffordableFor(player: Player): boolean {
        return player.gold >= this.getCost();    
    }
}

export function isBuyableDieFace(face: unknown): face is BuyableDieFace{
    return (face as BuyableDieFace).isAffordableFor !== undefined;
}
