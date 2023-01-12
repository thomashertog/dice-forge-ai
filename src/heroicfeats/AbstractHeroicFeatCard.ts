import chalk from "chalk";
import { CostType } from "../costType";

export abstract class AbstractHeroicFeatCard{

    cost: number;
    costType: CostType;

    constructor(cost: number, costType: CostType) {
        this.cost = cost;
        this.costType = costType;
    }

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
