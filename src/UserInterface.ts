import { Player } from "./Player";
import { PlayerAction } from "./cli";
import { Die } from "./dice/Die";
import { DieFace } from "./dice/faces/DieFace";
import { Game } from "./game";
import { HeroicFeatCard } from "./heroicfeats/HeroicFeatCard";
import { HeroicFeatPlatform } from "./heroicfeats/HeroicFeatPlatform";
import { ReinforcementEffect } from "./heroicfeats/ReinforcementEffect";

export interface UserInterface{

    getPlayerCount(): Promise<number>;

    chooseAction(game: Game, currentPlayer: Player): Promise<PlayerAction | undefined>;

    takeTurn(game: Game, currentPlayer: Player): Promise<boolean>;

    pickDieFace(game: Game, currentPlayer: Player, boughtDieFaces: Set<DieFace>): Promise<DieFace>;

    chooseDieToReplaceDieFace(game: Game, currentPlayer: Player, bought: DieFace): Promise<Die>;

    chooseDieFace(options: Array<DieFace>, game: Game, showOptions?: boolean): Promise<DieFace>;

    keepForging(game: Game, boughtDieFaces: Set<DieFace>): Promise<boolean>;

    pickPlatform(game: Game, currentPlayer: Player): Promise<HeroicFeatPlatform>;

    pickCardToBuy(game: Game, currentPlayer: Player, platform: HeroicFeatPlatform): Promise<HeroicFeatCard>;

    chooseResource(game: Game, playerName: string, value: number | null, ...options: string[]): Promise<string>;

    howMuchGoldForHammer(game: Game, currentPlayer: Player, value: number): Promise<number>;

    whichDieToRoll(game: Game, name: string): Promise<string>;

    whichReinforcement(game: Game, availableReinforcements: ReinforcementEffect[]): Promise<string>;
}