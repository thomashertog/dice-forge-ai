import assert from 'assert';
import chalk from 'chalk';
import { stdin as input, stdout as output } from 'process';
import * as readline from 'readline';
import { Player } from "../Player";
import { Die } from '../dice/Die';
import { DieFace } from '../dice/faces/DieFace';
import { Game } from "../game";
import { HeroicFeatCard } from '../heroicfeats/HeroicFeatCard';
import { HeroicFeatPlatform } from '../heroicfeats/HeroicFeatPlatform';
import { ReinforcementEffect } from '../heroicfeats/ReinforcementEffect';
import { countCardsByType, forge, getArrayOfNumberStringsUpTo, getDieFacesAsPrettyString, heroicFeat } from "../util";
import { BotInterface } from './BotInterface';
import { UserInterface } from './UserInterface';

export type PlayerAction = (game: Game, currentPlayer: Player) => void;

export class CommandLineInterface implements UserInterface {
    async botOrHuman(i: number): Promise<UserInterface> {
        const answer = await this.questionUntilValidAnswer(null, `Do you (player ${i +1}) want to be a Bot or a Human player?`, "B", "H").then(answer => answer.toUpperCase());

        if(answer === "H"){
            return new Promise(resolve => resolve(new CommandLineInterface()));
        }else if(answer === "B"){
            return new Promise(resolve => resolve(new BotInterface()));
        }
        return new Promise((resolve, reject) => reject());
    }

    terminal = readline.createInterface(input, output);

    async getPlayerCount(): Promise<number> {
        return await this.questionUntilValidAnswer(null, "How many people you want to play with? (2..4)", "2", "3", "4").then(parseInt);
    }

    async chooseAction(game: Game, currentPlayer: Player): Promise<PlayerAction | undefined> {
        const answer = await this.questionUntilValidAnswer(game, `
What do you (${currentPlayer.name}) want to do now?
Forge die face(s) / perform a Heroic feat / Pass
`, 'F', 'H', 'P').then(answer => answer.toUpperCase());
        if (answer === 'F') {
            return forge;
        } else if (answer === 'H') {
            return heroicFeat;
        }
        return;
    }

    async extraTurn(game: Game): Promise<boolean> {
        return (await this.questionUntilValidAnswer(game, `Would you like to perform an extra action for 2 sun shards? Yes / No`, "Y", "N")).toUpperCase() === 'Y';
    }

    async pickDieFace(game: Game, currentPlayer: Player, boughtDieFaces: Set<DieFace>): Promise<DieFace> {
        const buyableFaces = game.sanctuary.buyableDieFacesFor(currentPlayer.gold, boughtDieFaces);

        const buy = await (await this.questionUntilValidAnswer(game, `
    you have ${chalk.yellow(currentPlayer.gold)} to spend
    which die face are you going to buy?`,
            ...buyableFaces.map(dieface => dieface.code))).toUpperCase();

        const dieFace = buyableFaces.find(face => face.is(buy));
        assert(dieFace);
        return dieFace;
    }

    async chooseDieToReplaceDieFace(game: Game, currentPlayer: Player, bought: DieFace): Promise<Die> {
        let leftRight = (await this.questionUntilValidAnswer(game, `on which die you want to forge ${bought}? Left or Right`,
            'R', 'L'))
            .toUpperCase();

        if (leftRight === 'R') {
            return new Promise(resolve => resolve(currentPlayer.rightDie));
        } else if (leftRight === 'L') {
            return new Promise(resolve => resolve(currentPlayer.leftDie));
        } else {
            return new Promise((_resolve, reject) => reject);
        }
    }

    async chooseDieFace(options: Array<DieFace>, game: Game, showOptions?: boolean): Promise<DieFace> {
        showOptions = showOptions || false;
        const answer = await (await this.questionUntilValidAnswer(game,
            `${showOptions ? getDieFacesAsPrettyString('', options) : ''}
    which dieface do you pick?`,
            ...options.map(option => option.code))).toUpperCase();

        return options.find(option => option.is(answer)) as DieFace;
    }

    async keepForging(game: Game, boughtDieFaces: Set<DieFace>): Promise<boolean> {
        return (await this.questionUntilValidAnswer(game, `
You already bought: ${getDieFacesAsPrettyString("", Array.from(boughtDieFaces))}\n
Do you want to keep forging? (Y/N)`,
            'Y', 'N')).toUpperCase() === 'N';
    }

    async pickPlatform(game: Game, currentPlayer: Player): Promise<HeroicFeatPlatform> {
        let platformChoice = await (await this.questionUntilValidAnswer(game, "To which platform do you want to jump?", ...game.heroicFeats.availablePlatformsFor(currentPlayer).map(platform => platform.code))).toUpperCase();

        let platform = game.heroicFeats.platforms.find(platform => platform!.code === platformChoice);
        assert(platform);

        return platform;
    }

    async pickCardToBuy(game: Game, currentPlayer: Player, platform: HeroicFeatPlatform): Promise<HeroicFeatCard> {
        let availableCards = countCardsByType(platform.cards.filter(card => card.isAffordableFor(currentPlayer)));

        const cardsWithAmountsAvailable =
            Array.from(availableCards.entries())
                .map(([card, amount]) => `${card} (${amount})`).join(' | ');

        let chosenCardCode = await this.questionUntilValidAnswer(game,
            `Which card do you want to buy?`,
            ...Array.from(availableCards.keys()).map(card => card.getCode()));

        let chosenCard = platform.cards.find(card => card.getCode() === chosenCardCode.toUpperCase());

        assert(chosenCard);
        return chosenCard;
    }

    async chooseResource(game: Game, playerName: string, value: number | null, ...options: string[]): Promise<string> {
        return (await this.questionUntilValidAnswer(game, `you (${playerName}) want ${options.map(option => CommandLineInterface.toOptionString(option)).join(',')}? ${value !== null ? `(${value})` : ''}`, ...options)).toUpperCase();
    }

    private static toOptionString(code: string): string {
        switch (code) {
            case "G": return "Gold";
            case "P": return "glory Points";
            case "M": return "Moon shards";
            case "S": return "Sun shards";
            default: return "";
        }
        return "";
    }

    async howMuchGoldForHammer(game: Game, currentPlayer: Player, value: number): Promise<number> {
        if (currentPlayer.activeHammerCount === 0 || value < 0) {
            return 0;
        }

        const maxGoldForHammer = currentPlayer.activeHammerCount * 30 - currentPlayer.goldForHammer;


        return parseInt(await this.questionUntilValidAnswer(game, `
You (${currentPlayer.name}) have ${chalk.yellow(value)} to distribute.
How much would you like to add to the hammer? (0..${maxGoldForHammer < value ? maxGoldForHammer : value})
Everything else will go to your regular gold resource`, '0', ...getArrayOfNumberStringsUpTo(maxGoldForHammer < value ? maxGoldForHammer : value)));
    }

    async whichDieToRoll(game: Game, currentPlayer: Player): Promise<Die | undefined> {
        const answer = await this.questionUntilValidAnswer(game, `Do you (${currentPlayer.name}) want to roll your Left die or the Right die or Cancel?`, 'R', 'L', 'C').then(answer => answer.toUpperCase());

        if (answer === 'C') {
            return undefined;
        } else if (answer === 'L') {
            return currentPlayer.leftDie;
        } else if (answer === 'R') {
            return currentPlayer.rightDie;
        }
        return undefined;
    }

    async whichReinforcement(game: Game, availableReinforcements: ReinforcementEffect[]): Promise<ReinforcementEffect | undefined> {
        return this.questionUntilValidAnswer(game, `
${availableReinforcements.map(r => r.constructor.name).join(',')}        
Which reinforcement do you want to use or Pass?`, 'P', ...availableReinforcements.map(r => r.getCode())).then(answer => answer.toUpperCase()).then(answer => availableReinforcements.find(r => r.getCode() === answer));
    }

    private async questionUntilValidAnswer(game: Game | null, message: string, ...options: string[]): Promise<string> {
        options.map(option => option.toUpperCase());
        let answer = await this.question(game, message);
        while (!options.includes((answer + "").toUpperCase())) {
            console.log(`
            sorry, ${answer} is not valid
            it should be one of ${options.map(option => option.toUpperCase())}`);
            answer = await this.question(game, message);
        }
        return answer + "";
    }

    private async question(game: Game | null, message: string): Promise<string> {
        console.clear();
        if (!!game) {
            console.log(`${game}`);
        }
        return new Promise(resolve => { this.terminal.question(message, resolve); });
    }
}
