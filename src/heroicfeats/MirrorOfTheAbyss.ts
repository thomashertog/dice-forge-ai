import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class MirrorOfTheAbyss extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(5, CostType.SUN);
    }

    handleEffect(): void {
        //TODO
    }

    getGloryPointsAtEndOfGame(): number {
        return 10;
    }
}
