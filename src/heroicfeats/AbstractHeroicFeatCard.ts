import chalk from "chalk";
import { CostType } from "../CostType";
import { HeroicFeatCard } from "./HeroicFeatCard";

export abstract class AbstractHeroicFeatCard implements HeroicFeatCard{

    code: string;
    cost: number;
    costType: CostType;

    constructor(code: string, cost: number, costType: CostType) {
        this.code = code;
        this.cost = cost;
        this.costType = costType;
    }
    abstract getGloryPointsAtEndOfGame(): number;

    getCode(): string {
        return this.code;
    }

    getCost(): number{
        return this.cost;
    }

    getCostType(): CostType{
        return this.costType;
    }
    
    toString(): string{
        let result = `${this.constructor.name} -> `;
        switch(this.costType){
            case CostType.MOON: result += `${chalk.blue(this.cost)}`; break;
            case CostType.SUN: result += `${chalk.red(this.cost)}`; break;
            case CostType.BOTH: result += `${chalk.blue(this.cost)} + ${chalk.red(this.cost)}`; break;
            }

        result += `(${this.code})`;
        return result;
    }

}
