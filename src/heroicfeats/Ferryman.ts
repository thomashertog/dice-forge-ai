import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { HeroicFeatCard } from "./HeroicFeatCard";

export class FerryMan extends AbstractHeroicFeatCard implements HeroicFeatCard{

    constructor(){
        super(4, CostType.MOON);
    }

    getGloryPointsAtEndOfGame(): number {
        return 12;
    }
}
