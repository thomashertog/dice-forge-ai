import { CostType } from "../CostType";

export interface HeroicFeatCard{

    getGloryPointsAtEndOfGame(): number;
    getCost(): number;
    getCostType(): CostType;

}