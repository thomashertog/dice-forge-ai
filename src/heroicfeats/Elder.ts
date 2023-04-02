import { CostType } from "../CostType";
import { Player } from "../Player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class Elder extends AbstractHeroicFeatCard implements ReinforcementEffect {

    constructor() {
        super('E', 1, CostType.SUN);
    }

    addToListOfReinforcements(currentPlayer: Player): void {
        currentPlayer.reinforcements.push(this);
    }

    async handleReinforcement(currentPlayer: Player): Promise<boolean> {
        if (currentPlayer.gold >= 3) {
            await currentPlayer.addGold(-3);
            currentPlayer.addGloryPoints(4);
        }
        return new Promise((resolve) => { resolve(true) });
    }

    getGloryPointsAtEndOfGame(): number {
        return 0;
    }
}
