import { Buyable } from "../Buyable";
import { CostType } from "../CostType";

export interface HeroicFeatCard extends Buyable{

    getCode(): string;
    getGloryPointsAtEndOfGame(): number;
    getCost(): number;
    getCostType(): CostType;

    unstyledString(): string;
}