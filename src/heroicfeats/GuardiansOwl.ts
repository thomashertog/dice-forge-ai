import { CostType } from "../CostType";
import { Player } from "../Player";
import { CommandLineInterface } from "../interfaces/cli";
import { Game } from "../game";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class GuardiansOwl extends AbstractHeroicFeatCard implements ReinforcementEffect{

    constructor(){
        super('GO', 2, CostType.SUN);
    }

    addToListOfReinforcements(currentPlayer: Player): void {
        currentPlayer.reinforcements.push(this);
    }

    async handleReinforcement(game: Game, currentPlayer: Player): Promise<boolean> {
        const value = 1;

        let answer = await new CommandLineInterface().chooseResource(game, currentPlayer.name, value, 'G', 'M', 'S', 'C');
        
        switch(answer){
            case 'G': const goldForHammer = await new CommandLineInterface().howMuchGoldForHammer(game, currentPlayer, value);
            currentPlayer.addGoldToHammer(goldForHammer);
            currentPlayer.addGold(value - goldForHammer);
            break;
            case 'M': currentPlayer.addMoon(1); break;
            case 'S': currentPlayer.addSun(1); break;
            case 'C': return new Promise((resolve) => {resolve(false)});
        }
        return new Promise((resolve) => {resolve(true)});
    }

    getGloryPointsAtEndOfGame(): number {
        return 4;
    }
}
