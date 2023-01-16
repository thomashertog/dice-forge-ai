import { Player } from "../player";

export interface ReinforcementEffect{

    toString(): string;

    addToListOfReinforcements(currentPlayer: Player): void;

    handleReinforcement(currentPlayer: Player): Promise<boolean>;
}