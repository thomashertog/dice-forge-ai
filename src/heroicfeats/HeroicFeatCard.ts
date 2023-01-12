import { CostType } from "../costType";
import { InstantEffect } from "./InstantEffect";
import { ReinforcementEffect } from "./ReinforcementEffect";

export interface HeroicFeatCard{

    getGloryPointsAtEndOfGame(): number;
    getCost(): number;
    getCostType(): CostType;

}