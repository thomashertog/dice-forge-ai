import { CostType } from "../CostType";
import { Player } from "../Player";
import { Game } from "../game";
import { addGoldTo } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class WildSpirits extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('WS', 1, CostType.SUN);
    }

    async handleEffect(game: Game, currentPlayer: Player): Promise<void> {
        await addGoldTo(game, currentPlayer, 3);
        currentPlayer.addMoon(3);
    }

    getGloryPointsAtEndOfGame(): number {
        return 2;
    }
}
