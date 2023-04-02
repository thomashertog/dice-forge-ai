import { CostType } from "../CostType";
import { Helmet } from "../dice/faces/Helmet";
import { Player } from "../Player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class HelmetOfInvisibility extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('HOI', 5, CostType.MOON);
    }

    async handleEffect(currentPlayer: Player): Promise<void> {
        await currentPlayer.placeDieFaceOntoDie(new Helmet());
    }

    getGloryPointsAtEndOfGame(): number {
        return 4;
    }
}
