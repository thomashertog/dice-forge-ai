import { CostType } from "../CostType";
import { Player } from "../Player";
import { Game } from "../game";
import { addGoldTo } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class Elder extends AbstractHeroicFeatCard implements ReinforcementEffect {

    constructor() {
        super('E', 1, CostType.SUN);
    }

    addToListOfReinforcements(currentPlayer: Player): void {
        currentPlayer.reinforcements.push(this);
    }

    async handleReinforcement(game: Game, currentPlayer: Player): Promise<boolean> {
        if (currentPlayer.gold >= 3) {
            await addGoldTo(game, currentPlayer, -3);
            currentPlayer.addGloryPoints(4);
        }
        return new Promise((resolve) => { resolve(true) });
    }

    getGloryPointsAtEndOfGame(): number {
        return 0;
    }
}
