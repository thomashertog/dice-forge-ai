import { CostType, HeroicFeatCardType } from "./heroicfeatcardtype";
import chalk from 'chalk';

export class HeroicFeatCard{

    code: string;
    cost: number;
    costType: CostType;
    cardType: HeroicFeatCardType;

    constructor(code: string, cost: number, costType: CostType, cardType: HeroicFeatCardType){
        this.code = code;
        this.cost = cost;
        this.costType = costType;
        this.cardType = cardType;
    }

    toString = () => {
        let result = `${this.cardType} (`;
        switch(this.costType){
            case CostType.MOON: result += `${chalk.blue(this.cost)})`; break;
            case CostType.SUN: result += `${chalk.red(this.cost)})`; break;
            case CostType.BOTH: result += `${chalk.blue(this.cost)} + ${chalk.red(this.cost)})`; break;
        }
            return result;
    }
}

export class HeroicFeatPortal{

    code: string;
    cards: Array<HeroicFeatCard>;

    constructor(code: string, ...cards: Array<HeroicFeatCard>){
        this.code = code;
        this.cards = cards;
    }

    toString = () => {
        let result = `${this.code}: `;
        for(let card of this.cards){
            result += `\t${card};`;
        }
        return result;
    }
}