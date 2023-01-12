import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Sphinx extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(6, CostType.SUN);
    }

    handleEffect(): void {
        //TODO
    }

    getGloryPointsAtEndOfGame(): number {
        return 10;
    }
}
