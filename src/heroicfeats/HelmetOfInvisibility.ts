import { CostType } from "../costType";
import { DieFaceOption } from "../diefaceoption";
import { Player } from "../player";
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
