import { Player } from "../Player";
import { Game } from "../game";
import { countCardsByType, receiveDivineBlessing } from "../util";
import { HeroicFeatCard } from "./HeroicFeatCard";

export class HeroicFeatPlatform {

    code: string;
    cards: Array<HeroicFeatCard>;
    player: Player | null;

    constructor(code: string, ...cards: Array<HeroicFeatCard>) {
        this.code = code;
        this.cards = cards;
        this.player = null;
    }

    toString(): string {
        let result = `${this.code.padStart(2)} (${this.player?.name || ""}): `;

        let cardsWithAmountsAvailable = countCardsByType(this.cards);

        return Array.from(cardsWithAmountsAvailable.entries())
            .reduce((accumulator, [card, amount]) => { 
                accumulator += `${card} (${amount})`;
                for(let i = card.unstyledString().length; i < 25; i++){
                    accumulator += ' ';
                }
                return accumulator;
             }, result)
    }

    async handleEventualOusting(game: Game, currentPlayer: Player): Promise<void> {
        if(this.player !== null && this.player !== currentPlayer){
            await receiveDivineBlessing(game, currentPlayer);
        }
    }

}