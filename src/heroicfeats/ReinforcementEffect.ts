import { Player } from "../Player";

export interface ReinforcementEffect{

    toString(): string;

    addToListOfReinforcements(currentPlayer: Player): void;

    handleReinforcement(currentPlayer: Player): Promise<boolean>;
}