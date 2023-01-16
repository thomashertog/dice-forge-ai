import { CostType } from "../costType";
import { Player } from "../player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class WildSpirits extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(1, CostType.SUN);
    }

    handleEffect(currentPlayer: Player): void {
        currentPlayer.addGold(3);
        currentPlayer.addMoon(3);
    }

    getGloryPointsAtEndOfGame(): number {
        return 2;
    }
}
