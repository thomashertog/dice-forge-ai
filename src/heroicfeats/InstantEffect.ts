import { Player } from "../Player";
import { Game } from "../game";

export interface InstantEffect{

    handleEffect(game: Game, currentPlayer: Player): void;
}