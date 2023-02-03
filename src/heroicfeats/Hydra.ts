import { CostType } from "../CostType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";

export class Hydra extends AbstractHeroicFeatCard{

    constructor(){
        super('H', 5, CostType.BOTH);
    }

    getGloryPointsAtEndOfGame(): number {
        return 26;
    }
}
