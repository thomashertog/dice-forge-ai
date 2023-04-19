import { CommandLineInterface } from "../interfaces/cli";
import { CostType } from "../CostType";
import { Helmet } from "../dice/faces/Helmet";
import { Game } from "../game";
import { Player } from "../Player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class HelmetOfInvisibility extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('HOI', 5, CostType.MOON);
    }

    async handleEffect(game: Game, currentPlayer: Player): Promise<void> {
        const die = await currentPlayer.getUserInterface().chooseDieToReplaceDieFace(game, currentPlayer, new Helmet());
        let dieFaceToReplace = await currentPlayer.getUserInterface().chooseDieFaceToBeReplaced(die.faces, game, new Helmet());
        
        die.replaceFace(dieFaceToReplace, new Helmet(), game);
    }

    getGloryPointsAtEndOfGame(): number {
        return 4;
    }
}
