import { CostType, HeroicFeatCardType } from "./heroicfeatcardtype";
import chalk from 'chalk';

export class HeroicFeatCard{

    cost: number;
    costType: CostType;
    cardType: HeroicFeatCardType;

    constructor(cost: number, costType: CostType, cardType: HeroicFeatCardType){
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

    cards: Array<HeroicFeatCard>;

    constructor(...cards: Array<HeroicFeatCard>){
        this.cards = cards;
    }

    toString = () => {
        let result = "";
        for(let card of this.cards){
            result += `${card}`;
        }
        return result;
    }
}