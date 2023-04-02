import { CostType } from "../CostType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";

export class Ferryman extends AbstractHeroicFeatCard{

    constructor(){
        super('F', 4, CostType.MOON);
    }

    getGloryPointsAtEndOfGame(): number {
        return 12;
    }
}
