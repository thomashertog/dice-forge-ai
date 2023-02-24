import { Player } from "../Player";

export interface ReinforcementEffect{

    toString(): string;
    getCode(): string;

    addToListOfReinforcements(currentPlayer: Player): void;

    handleReinforcement(currentPlayer: Player): Promise<boolean>;
}