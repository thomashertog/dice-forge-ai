import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";

export class Hydra extends AbstractHeroicFeatCard{

    constructor(){
        super(5, CostType.BOTH);
    }

    getGloryPointsAtEndOfGame(): number {
        return 26;
    }
}
