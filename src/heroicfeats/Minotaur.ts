import { CostType } from "../CostType";
import { Player } from "../Player";
import { ResolveMode } from "../ResolveMode";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Minotaur extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(3, CostType.SUN);
    }

    async handleEffect(currentPlayer: Player): Promise<void> {
        for(let player of currentPlayer.game.players){
            if(player === currentPlayer){
                continue;
            }
            let rolls = player.divineBlessing();
            await player.game.resolveDieRolls(player, rolls, ResolveMode.SUBTRACT);
        }
    }

    getGloryPointsAtEndOfGame(): number {
        return 8;
    }
}
