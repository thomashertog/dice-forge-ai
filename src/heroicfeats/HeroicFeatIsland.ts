import { AllHeroicFeats } from "../data";
import { HeroicFeatCard } from "./HeroicFeatCard";
import { HeroicFeatPlatform as HeroicFeatPlatform } from "./HeroicFeatPlatform";

export class HeroicFeatIsland{

    platforms: Array<HeroicFeatPlatform>;

    constructor(numberOfPlayers: number) {
        this.platforms = new Array();
        for (let portal of AllHeroicFeats) {
            let cards = new Array<HeroicFeatCard>();
            for (let card of portal.cards) {
                for (let i = 1; i <= numberOfPlayers; i++) {
                    cards.push(card);
                }
            }
            this.platforms.push(new HeroicFeatPlatform(portal.code, ...cards));
        }
    }
}