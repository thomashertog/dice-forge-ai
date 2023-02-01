import { CostType } from "../CostType";
import { DieFaceOption } from "../dice/DieFaceOption";
import { Player } from "../Player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class MirrorOfTheAbyss extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(5, CostType.SUN);
    }

    async handleEffect(currentPlayer: Player): Promise<void> {
        let die = await currentPlayer.chooseDieToReplaceDieFace(DieFaceOption.MIRROR);
        await die.replaceFace(DieFaceOption.MIRROR);
    }

    getGloryPointsAtEndOfGame(): number {
        return 10;
    }
}
