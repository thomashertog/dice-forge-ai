import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { HeroicFeatCard } from "./HeroicFeatCard";

export class Hydra extends AbstractHeroicFeatCard implements HeroicFeatCard{

    constructor(){
        super(5, CostType.BOTH);
    }

    getGloryPointsAtEndOfGame(): number {
        return 26;
    }
}
