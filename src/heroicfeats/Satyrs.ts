import { CostType } from "../CostType";
import { DieFace } from "../dice/faces/DieFace";
import { Player } from "../Player";
import { ResolveMode } from "../ResolveMode";
import { getArrayOfNumberStringsUpTo, questionUntilValidAnswer } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Satyrs extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(3, CostType.MOON);
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

        let first = await questionUntilValidAnswer(`
        players have rolled ${rolls.map(roll => roll.toString())}
        which is the first face you want to copy? (1..${rolls.length})`, ...getArrayOfNumberStringsUpTo(rolls.length));
        let second = await questionUntilValidAnswer(`which is the second face you want to copy? (1..${rolls.length})`, ...getArrayOfNumberStringsUpTo(rolls.length).filter(value => value !== first));

        let rollsToResolve = new Array<DieFace>;
        rollsToResolve.push(rolls[parseInt(first)-1]);
        rollsToResolve.push(rolls[parseInt(second)-1]);
        await currentPlayer.resolveDieRolls(rollsToResolve, ResolveMode.ADD); 
    }

    getGloryPointsAtEndOfGame(): number {
        return 6;
    }
}
