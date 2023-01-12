import { CostType } from "../costType";

export interface HeroicFeatCard{

    getGloryPointsAtEndOfGame(): number;
    getCost(): number;
    getCostType(): CostType;
}