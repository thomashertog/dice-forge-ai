import { Player } from "../Player";
import { Die } from "../dice/Die";
import { DieFace } from "../dice/faces/DieFace";
import { Game } from "../game";
import { HeroicFeatCard } from "../heroicfeats/HeroicFeatCard";
import { HeroicFeatPlatform } from "../heroicfeats/HeroicFeatPlatform";
import { ReinforcementEffect } from "../heroicfeats/ReinforcementEffect";
import { PlayerAction } from "./cli";

export interface UserInterface{

    chooseAction(game: Game, currentPlayer: Player): Promise<PlayerAction | undefined>;

    extraTurn(game: Game): Promise<boolean>;
    
    pickDieFace(game: Game, currentPlayer: Player, boughtDieFaces: Set<DieFace>): Promise<DieFace>;

    chooseDieToReplaceDieFace(game: Game, currentPlayer: Player, bought: DieFace): Promise<Die>;

    chooseDieFace(options: Array<DieFace>, game: Game, showOptions?: boolean): Promise<DieFace>;

    keepForging(game: Game, boughtDieFaces: Set<DieFace>): Promise<boolean>;

    pickPlatform(game: Game, currentPlayer: Player): Promise<HeroicFeatPlatform>;

    pickCardToBuy(game: Game, currentPlayer: Player, platform: HeroicFeatPlatform): Promise<HeroicFeatCard>;

    chooseResource(game: Game, playerName: string, value: number | null, ...options: string[]): Promise<string>;

    howMuchGoldForHammer(game: Game, currentPlayer: Player, value: number): Promise<number>;

    whichDieToRoll(game: Game, currentPlayer: Player): Promise<Die | undefined>;

    whichReinforcement(game: Game, availableReinforcements: ReinforcementEffect[]): Promise<ReinforcementEffect | undefined>;
}