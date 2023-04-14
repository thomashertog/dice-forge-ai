import { CommandLineInterface } from "../../cli";
import { Game } from "../../game";
import { Player } from "../../Player";
import { addGoldTo } from "../../util";
import { InteractiveDieFace } from "./InteractiveDieFace";

export abstract class GoldenDieFace extends InteractiveDieFace {

    constructor(code: string, cost: number = 0) {
        super(code, cost);
    }

    async resolveGold(game: Game, currentPlayer: Player, value: number): Promise<void> {
        await addGoldTo(game, currentPlayer, value);
    }
}