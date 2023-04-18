import { AllHeroicFeats } from "../data";
import { Player } from "../Player";
import { HeroicFeatPlatform } from "./HeroicFeatPlatform";

export class HeroicFeatIsland{

    platforms: Array<HeroicFeatPlatform>;

    constructor(numberOfPlayers: number) {
        this.platforms = new Array();
        for (let portal of AllHeroicFeats) {
            let cards = [];
            for(let i = 0; i<numberOfPlayers; i++){
                cards.push(...portal.cards)
            }
            this.platforms.push(new HeroicFeatPlatform(portal.code, ...cards));
        }
    }

    toString(): string{
        return this.platforms.map(platform => platform.toString()).join('\n');
    }

    availablePlatformsFor(player: Player): Array<HeroicFeatPlatform> {
        return this.platforms.filter(platform => platform.cards.filter(card => card.isAffordableFor(player)).length > 0);
    }

    clearPlayerFromItsCurrentPlatform(player: Player): void {
        let currentPlatform = this.platforms.find(platform => platform.player === player);
        if (currentPlatform !== undefined) {
            currentPlatform.player = null;
        }
    }
}