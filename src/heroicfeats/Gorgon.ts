import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { HeroicFeatCard } from "./HeroicFeatCard";

export class Gorgon extends AbstractHeroicFeatCard implements HeroicFeatCard{

    constructor(){
        super(4, CostType.SUN);
    }

    getGloryPointsAtEndOfGame(): number {
        return 14;
    }
}
