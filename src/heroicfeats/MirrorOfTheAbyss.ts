import { CostType } from "../CostType";
import { Mirror } from "../dice/faces/Mirror";
import { Player } from "../Player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class MirrorOfTheAbyss extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('MOTA', 5, CostType.SUN);
    }

    async handleEffect(currentPlayer: Player): Promise<void> {
        await currentPlayer.placeDieFaceOntoDie(new Mirror());
    }

    getGloryPointsAtEndOfGame(): number {
        return 10;
    }
}
