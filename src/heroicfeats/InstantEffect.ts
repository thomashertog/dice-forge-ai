import { Player } from "../Player";

export interface InstantEffect{

    handleEffect(currentPlayer: Player): void;
}