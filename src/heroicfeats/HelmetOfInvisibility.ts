import { CommandLineInterface } from "../cli";
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
        const die = await new CommandLineInterface().chooseDieToReplaceDieFace(game, currentPlayer, new Helmet());
        let dieFaceToReplace = await new CommandLineInterface().chooseDieFace(die.faces, game);
        
        die.replaceFace(dieFaceToReplace, new Helmet(), game);
    }

    getGloryPointsAtEndOfGame(): number {
        return 4;
    }
}
