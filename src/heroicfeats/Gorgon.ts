import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";

export class Gorgon extends AbstractHeroicFeatCard {

    constructor(){
        super(4, CostType.SUN);
    }

    getGloryPointsAtEndOfGame(): number {
        return 14;
    }
}
