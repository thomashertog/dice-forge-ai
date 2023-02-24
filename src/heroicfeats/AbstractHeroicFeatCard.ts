import chalk from "chalk";
import { CostType } from "../CostType";
import { Player } from "../Player";
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
        let result = `${this.constructor.name} (${this.code}) -> `;
        switch(this.costType){
            case CostType.MOON: result += `${chalk.blue(this.cost)}`; break;
            case CostType.SUN: result += `${chalk.red(this.cost)}`; break;
            case CostType.BOTH: result += `${chalk.blue(this.cost)} + ${chalk.red(this.cost)}`; break;
            }
        return result;
    }

    canBeBoughtBy(player: Player):boolean{
        switch(this.getCostType()){
            case CostType.MOON: return this.getCost() <= player.moon;
            case CostType.SUN: return this.getCost() <= player.sun;
            case CostType.BOTH: return this.getCost() <= player.moon && this.getCost() <= player.sun;
        }
    }
}
