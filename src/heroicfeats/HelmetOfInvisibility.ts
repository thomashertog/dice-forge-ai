import { CostType } from "../CostType";
import { DieFaceOption } from "../dice/DieFaceOption";
import { Player } from "../Player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class HelmetOfInvisibility extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(5, CostType.MOON);
    }

    async handleEffect(currentPlayer: Player): Promise<void> {
        let die = await currentPlayer.chooseDieToReplaceDieFace(DieFaceOption.HELMET);
        await die.replaceFace(DieFaceOption.HELMET);
    }

    getGloryPointsAtEndOfGame(): number {
        return 4;
    }
}
