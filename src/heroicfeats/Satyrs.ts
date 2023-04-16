import assert from "assert";
import { CostType } from "../CostType";
import { Player } from "../Player";
import { ResolveMode } from "../ResolveMode";
import { CommandLineInterface } from "../interfaces/cli";
import { DieFace } from "../dice/faces/DieFace";
import { Game } from "../game";
import { resolveDieRolls } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Satyrs extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('S', 3, CostType.MOON);
    }

    async handleEffect(game: Game, currentPlayer: Player): Promise<void> {
        let rolls = new Array<DieFace>;
        
        for(let player of game.players){
            if(player === currentPlayer){
                continue;
            }
            
            rolls.push(player.leftDie.roll());
            rolls.push(player.rightDie.roll());
        }

        const chosenDieFaces: DieFace[] = [];

        const first = await new CommandLineInterface().chooseDieFace(rolls, game, true);
        let dieface = rolls.splice(rolls.findIndex(roll => roll.code === first.code), 1).at(0);
        assert(dieface);
        chosenDieFaces.push(dieface);

        const second = await new CommandLineInterface().chooseDieFace(rolls, game, true);
        chosenDieFaces.push(second);

        let rollsToResolve = new Array<DieFace>;
        rollsToResolve.push(...chosenDieFaces);
        
        await resolveDieRolls(game, currentPlayer, rollsToResolve, ResolveMode.ADD); 
    }

    getGloryPointsAtEndOfGame(): number {
        return 6;
    }
}
