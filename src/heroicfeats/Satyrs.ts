import { CostType } from "../CostType";
import { DieFace } from "../dice/faces/DieFace";
import { Player } from "../Player";
import { ResolveMode } from "../ResolveMode";
import { getArrayOfNumberStringsUpTo, questionUntilValidAnswer } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Satyrs extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('S', 3, CostType.MOON);
    }

    async handleEffect(currentPlayer: Player): Promise<void> {
        let rolls = new Array<DieFace>;
        
        for(let player of currentPlayer.game.players){
            if(player === currentPlayer){
                continue;
            }
            
            rolls.push(player.leftDie.roll());
            rolls.push(player.rightDie.roll());
        }

        let first = await questionUntilValidAnswer(currentPlayer.game, `
        players have rolled ${rolls.map(roll => roll.toString())}
        which is the first face you want to copy?`, ...rolls.map(roll => roll.code));
        let chosen = rolls.splice(rolls.findIndex(roll => roll.code === first));
        let second = await questionUntilValidAnswer(currentPlayer.game, `you chose ${chosen}\n${rolls.map(roll => roll.toString())} are available\nwhich is the second face you want to copy? `, ...rolls.map(roll => roll.code));

        let rollsToResolve = new Array<DieFace>;
        rollsToResolve.push(rolls.find(roll => roll.code === first) as DieFace);
        rollsToResolve.push(rolls.find(roll => roll.code === second) as DieFace);
        await currentPlayer.resolveDieRolls(rollsToResolve, ResolveMode.ADD); 
    }

    getGloryPointsAtEndOfGame(): number {
        return 6;
    }
}
