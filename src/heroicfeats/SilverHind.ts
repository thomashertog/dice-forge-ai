import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class SilverHind extends AbstractHeroicFeatCard implements ReinforcementEffect{
    
    constructor(){
        super(2, CostType.MOON);
    }

    handleReinforcement(): void {
        //TODO
    }

    getGloryPointsAtEndOfGame(): number {
        return 2;
    }
}
