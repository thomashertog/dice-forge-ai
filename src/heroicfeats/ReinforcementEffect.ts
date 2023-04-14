import { Player } from "../Player";
import { Game } from "../game";

export interface ReinforcementEffect{

    toString(): string;
    getCode(): string;

    addToListOfReinforcements(currentPlayer: Player): void;

    handleReinforcement(game: Game, currentPlayer: Player): Promise<boolean>;
}