import { CostType } from "../CostType";
import { Player } from "../Player";
import { getDieFacesAsPrettyString, questionUntilValidAnswer } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Sphinx extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('S', 6, CostType.SUN);
    }

    async handleEffect(currentPlayer: Player): Promise<void> {
        let leftRight = await (await questionUntilValidAnswer(currentPlayer.game, `do you want to roll your Left die or your Right die?`, 'L', 'R')).toUpperCase();

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
