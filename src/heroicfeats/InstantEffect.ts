import { Player } from "../player";

export interface InstantEffect{

    handleEffect(currentPlayer: Player): void;
}