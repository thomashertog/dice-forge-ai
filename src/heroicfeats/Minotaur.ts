import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Minotaur extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(3, CostType.SUN);
    }

    handleEffect(): void {
        //TODO
    }

    getGloryPointsAtEndOfGame(): number {
        return 8;
    }
}
