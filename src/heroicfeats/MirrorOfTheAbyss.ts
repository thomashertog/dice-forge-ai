import { CostType } from "../costType";
import { DieFaceOption } from "../diefaceoption";
import { Player } from "../player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class MirrorOfTheAbyss extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(5, CostType.SUN);
    }

    handleEffect(currentPlayer: Player): void {
        currentPlayer.chooseDieToReplaceDieFace(DieFaceOption.MIRROR);
    }

    getGloryPointsAtEndOfGame(): number {
        return 10;
    }
}
