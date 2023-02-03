import { CostType } from "../CostType";

export interface HeroicFeatCard{

    getCode(): string;
    getGloryPointsAtEndOfGame(): number;
    getCost(): number;
    getCostType(): CostType;

}