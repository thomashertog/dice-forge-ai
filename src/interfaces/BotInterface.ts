import assert from "assert";
import { Player } from "../Player";
import { Die } from "../dice/Die";
import { DieFace } from "../dice/faces/DieFace";
import { Game } from "../game";
import { HeroicFeatCard } from "../heroicfeats/HeroicFeatCard";
import { HeroicFeatPlatform } from "../heroicfeats/HeroicFeatPlatform";
import { ReinforcementEffect } from "../heroicfeats/ReinforcementEffect";
import { coinToss, forge, getRandomElementOfArray, heroicFeat, randomNumberUpUntil } from "../util";
import { UserInterface } from "./UserInterface";
import { PlayerAction } from "./cli";

export class BotInterface implements UserInterface {

    chooseAction(game: Game, currentPlayer: Player): Promise<PlayerAction | undefined> {
        const possibleActions = new Array<PlayerAction | undefined>();
        if (game.sanctuary.lowestAvailablePoolCost(currentPlayer.gold) !== -1) {
            possibleActions.push(forge);
        }
        if (game.heroicFeats.availablePlatformsFor(currentPlayer).length !== 0) {
            possibleActions.push(heroicFeat);
        }
        if (possibleActions.length === 0) {
            possibleActions.push(undefined);
        }

        return new Promise(resolve => resolve(getRandomElementOfArray(possibleActions)));
    }

    extraTurn(_game: Game): Promise<boolean> {
        return new Promise(resolve => resolve(coinToss()));
    }

    pickDieFace(game: Game, currentPlayer: Player, boughtDieFaces: Set<DieFace>): Promise<DieFace> {
        const buyableDieFaces = game.sanctuary.buyableDieFacesFor(currentPlayer.gold, boughtDieFaces);

        const buy = getRandomElementOfArray(buyableDieFaces);
        return new Promise(resolve => resolve(buy));
    }

    chooseDieToReplaceDieFace(_game: Game, currentPlayer: Player, _bought: DieFace): Promise<Die> {
        const dieChoice = coinToss() ? currentPlayer.leftDie : currentPlayer.rightDie;

        return new Promise(resolve => resolve(dieChoice));
    }

    chooseDieFace(options: DieFace[], _game: Game, _showOptions?: boolean | undefined): Promise<DieFace> {
        return new Promise(resolve => resolve(getRandomElementOfArray(options)));
    }

    keepForging(_game: Game, _boughtDieFaces: Set<DieFace>): Promise<boolean> {
        return new Promise(resolve => resolve(coinToss()));
    }
    pickPlatform(game: Game, currentPlayer: Player): Promise<HeroicFeatPlatform> {
        return new Promise(resolve => resolve(getRandomElementOfArray(game.heroicFeats.availablePlatformsFor(currentPlayer))));
    }

    pickCardToBuy(game: Game, currentPlayer: Player, platform: HeroicFeatPlatform): Promise<HeroicFeatCard> {
        return new Promise(resolve => resolve(getRandomElementOfArray(platform.cards.filter(card => card.isAffordableFor(currentPlayer)))));
    }
 
    chooseResource(_game: Game, _playerName: string, _value: number | null, ...options: string[]): Promise<string> {
        return new Promise(resolve => resolve(getRandomElementOfArray(options)));
    }
 
    howMuchGoldForHammer(_game: Game, _currentPlayer: Player, value: number): Promise<number> {
        return new Promise(resolve => resolve(randomNumberUpUntil(value)))
    }
 
    whichDieToRoll(_game: Game, currentPlayer: Player): Promise<Die | undefined> {
        const options = [currentPlayer.leftDie, currentPlayer.rightDie, undefined];
        return new Promise(resolve => resolve(getRandomElementOfArray(options)));
    }
 
    whichReinforcement(_game: Game, availableReinforcements: ReinforcementEffect[]): Promise<ReinforcementEffect> {
        const arr: Array<ReinforcementEffect | undefined> = [...availableReinforcements, undefined];
        return new Promise(resolve => resolve(getRandomElementOfArray(availableReinforcements)));
    }

}