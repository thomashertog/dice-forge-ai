import chalk from "chalk";
import { CostType } from "../costType";
import { HeroicFeatCard } from "./HeroicFeatCard";
import { InstantEffect } from "./InstantEffect";
import { ReinforcementEffect } from "./ReinforcementEffect";

export abstract class AbstractHeroicFeatCard implements HeroicFeatCard{

    cost: number;
    costType: CostType;

    constructor(cost: number, costType: CostType) {
        this.cost = cost;
        this.costType = costType;
    }
    abstract getGloryPointsAtEndOfGame(): number;

    getCost(): number{
        return this.cost;
    }

    getCostType(): CostType{
        return this.costType;
    }
    
    toString = () => {
        let result = `${this.constructor.name} (`;
        switch(this.costType){
            case CostType.MOON: result += `${chalk.blue(this.cost)})`; break;
            case CostType.SUN: result += `${chalk.red(this.cost)})`; break;
            case CostType.BOTH: result += `${chalk.blue(this.cost)} + ${chalk.red(this.cost)})`; break;
            }
        return result;
    }

}
