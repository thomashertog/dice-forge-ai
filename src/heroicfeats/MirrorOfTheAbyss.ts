import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { HeroicFeatCard } from "./HeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class MirrorOfTheAbyss extends AbstractHeroicFeatCard implements HeroicFeatCard, InstantEffect{

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
