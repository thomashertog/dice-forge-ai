import { CommandLineInterface } from "../interfaces/cli";
import { CostType } from "../CostType";
import { Mirror } from "../dice/faces/Mirror";
import { Game } from "../game";
import { Player } from "../Player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class MirrorOfTheAbyss extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('MOTA', 5, CostType.SUN);
    }

    async handleEffect(game: Game, currentPlayer: Player): Promise<void> {
        const die = await currentPlayer.getUserInterface().chooseDieToReplaceDieFace(game, currentPlayer, new Mirror());
        let dieFaceToReplace = await currentPlayer.getUserInterface().chooseDieFaceToReceiveEffect(die.faces, game);
        
        die.replaceFace(dieFaceToReplace, new Mirror(), game);
    }

    getGloryPointsAtEndOfGame(): number {
        return 10;
    }
}
