import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Satyrs extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(3, CostType.MOON);
    }

    handleEffect(): void {
        //TODO
    }

    getGloryPointsAtEndOfGame(): number {
        return 6;
    }
}
