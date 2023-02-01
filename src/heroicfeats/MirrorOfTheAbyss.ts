import { CostType } from "../CostType";
import { Mirror } from "../dice/faces/Mirror";
import { Player } from "../Player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class MirrorOfTheAbyss extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(5, CostType.SUN);
    }

    async handleEffect(currentPlayer: Player): Promise<void> {
        let die = await currentPlayer.chooseDieToReplaceDieFace(new Mirror());
        await die.replaceFace(new Mirror());
    }

    getGloryPointsAtEndOfGame(): number {
        return 10;
    }
}
