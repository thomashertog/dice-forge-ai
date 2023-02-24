import { Player } from "./Player";

export interface Buyable{

    getCost(): number;
    isAffordableFor(player: Player): boolean;
}