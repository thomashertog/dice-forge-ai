import { CostType } from "../CostType";
import { Player } from "../Player";
import { ResolveMode } from "../ResolveMode";
import { Game } from "../game";
import { divineBlessing, receiveDivineBlessing, resolveDieRolls } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Minotaur extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('M', 3, CostType.SUN);
    }

    async handleEffect(game: Game, currentPlayer: Player): Promise<void> {
        for(let player of game.players){
            if(player === currentPlayer){
                continue;
            }
            let rolls = divineBlessing(player);
            await resolveDieRolls(game, player, rolls, ResolveMode.SUBTRACT);
        }
    }

    getGloryPointsAtEndOfGame(): number {
        return 8;
    }
}
