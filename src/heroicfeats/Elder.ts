import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { HeroicFeatCard } from "./HeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class Elder extends AbstractHeroicFeatCard implements HeroicFeatCard, ReinforcementEffect{

    constructor(){
        super(1, CostType.SUN);
    }

    handleReinforcement(): void {
        //TODO
    }

    getGloryPointsAtEndOfGame(): number {
        return 0;
    }
}
