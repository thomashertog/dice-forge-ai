import { HeroicFeatCard } from "./HeroicFeatCard";

export class HeroicFeatPortal{

    code: string;
    cards: Array<HeroicFeatCard>;

    constructor(code: string, ...cards: Array<HeroicFeatCard>){
        this.code = code;
        this.cards = cards;
    }

    toString():string {
        let result = `${this.code}: `;
        for(let card of this.cards){
            result += `\t${card};`;
        }
        return result;
    }
}