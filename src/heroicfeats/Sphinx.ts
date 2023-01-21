import { CostType } from "../costType";
import { Player } from "../player";
import { getDieFacesAsPrettyString, questionUntilValidAnswer } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Sphinx extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(6, CostType.SUN);
    }

    async handleEffect(currentPlayer: Player): Promise<void> {
        let leftRight = await (await questionUntilValidAnswer(`you have these resources available ${currentPlayer.getResourcesString()}\n${getDieFacesAsPrettyString('left', currentPlayer.leftDie.faces)}\t${getDieFacesAsPrettyString('right', currentPlayer.rightDie.faces)}\ndo you want to roll your Left die (L) or your Right die (R)`, 'L', 'R')).toUpperCase();

        if(leftRight === 'L'){
            await currentPlayer.minorBlessing(currentPlayer.leftDie);
            await currentPlayer.minorBlessing(currentPlayer.leftDie);
            await currentPlayer.minorBlessing(currentPlayer.leftDie);
            await currentPlayer.minorBlessing(currentPlayer.leftDie);
        }else if(leftRight === 'R'){
            await currentPlayer.minorBlessing(currentPlayer.rightDie);
            await currentPlayer.minorBlessing(currentPlayer.rightDie);
            await currentPlayer.minorBlessing(currentPlayer.rightDie);
            await currentPlayer.minorBlessing(currentPlayer.rightDie);
        }
    }

    getGloryPointsAtEndOfGame(): number {
        return 10;
    }
}
