import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { HeroicFeatCard } from "./HeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class SilverHind extends AbstractHeroicFeatCard implements HeroicFeatCard, ReinforcementEffect{
    
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
