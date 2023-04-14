import assert from 'assert';
import chalk from 'chalk';
import { stdin as input, stdout as output } from 'process';
import * as readline from 'readline';
import { Player } from "./Player";
import { Die } from './dice/Die';
import { DieFace } from './dice/faces/DieFace';
import { Game } from "./game";
import { HeroicFeatPlatform } from './heroicfeats/HeroicFeatPlatform';
import { countCardsByType, forge, getArrayOfNumberStringsUpTo, getDieFacesAsPrettyString, heroicFeat } from "./util";
import { HeroicFeatCard } from './heroicfeats/HeroicFeatCard';
import { ReinforcementEffect } from './heroicfeats/ReinforcementEffect';

export class CommandLineInterface {
    static terminal = readline.createInterface(input, output);

    static async getPlayerCount(): Promise<number> {
        return await CommandLineInterface.questionUntilValidAnswer(null, "How many people you want to play with? (2..4)", "2", "3", "4").then(parseInt);
    }

    static async takeTurn(game: Game, currentPlayer: Player): Promise<boolean> {
        try {
            let answer = (await CommandLineInterface.questionUntilValidAnswer(game, "What do you want to do now? Forge / Heroic feat / Pass", 'F', 'H', 'P')).toUpperCase();
            if (answer === 'F') {
                await forge(game, currentPlayer);
            } else if (answer === 'H') {
                await heroicFeat(game, currentPlayer);
            } else if (answer === 'P') {
                return new Promise(resolve => resolve(false));
            }
        } catch (err) {
            console.log(`WTF, something is wrong here\nerr: ${err}`);
        }
        return new Promise(resolve => resolve(true));
    }

    static async extraTurn(game: Game): Promise<boolean> {
        return (await CommandLineInterface.questionUntilValidAnswer(game, `Would you like to perform an extra action for 2 sun shards? Yes / No`, "Y", "N")).toUpperCase() === 'Y';
    }

    static async pickDieFace(game: Game, currentPlayer: Player, boughtDieFaces: Set<DieFace>): Promise<DieFace> {
        let buyableFaces = game.sanctuary.buyableDieFacesFor(currentPlayer.gold, boughtDieFaces);

        let buy = await (await CommandLineInterface.questionUntilValidAnswer(game, `
    you have ${chalk.yellow(currentPlayer.gold)} to spend
    which die face are you going to buy?`,
            ...buyableFaces.map(dieface => dieface.code))).toUpperCase();

        let dieFace = buyableFaces.find(face => face.is(buy));
        assert(dieFace);
        return dieFace;
    }

    static async chooseDieToReplaceDieFace(game: Game, currentPlayer: Player, bought: DieFace): Promise<Die> {
        let leftRight = (await CommandLineInterface.questionUntilValidAnswer(game, `on which die you want to forge ${bought}? Left or Right`,
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

    static async chooseDieFace(options: Array<DieFace>, game: Game, showOptions?: boolean): Promise<DieFace> {
        showOptions = showOptions || false;
        const answer = await (await CommandLineInterface.questionUntilValidAnswer(game,
            `${showOptions ? getDieFacesAsPrettyString('', options) : ''}
    which dieface do you pick?`,
            ...options.map(option => option.code))).toUpperCase();

        return options.find(option => option.is(answer)) as DieFace;
    }

    static async keepForging(game: Game, boughtDieFaces: Set<DieFace>): Promise<boolean> {
        return (await CommandLineInterface.questionUntilValidAnswer(game, `
You already bought: ${getDieFacesAsPrettyString("", Array.from(boughtDieFaces))}\n
Do you want to keep forging? (Y/N)`,
            'Y', 'N')).toUpperCase() === 'N';
    }

    static async pickPlatform(game: Game, currentPlayer: Player): Promise<HeroicFeatPlatform> {
        let platformChoice = await (await CommandLineInterface.questionUntilValidAnswer(game, "To which platform do you want to jump?", ...game.heroicFeats.availablePlatformsFor(currentPlayer))).toUpperCase();
    
        let platform = game.heroicFeats.platforms.find(platform => platform!.code === platformChoice);
        assert(platform);
    
        return platform;
    }

    static async pickCardToBuy(game: Game, currentPlayer: Player, platform: HeroicFeatPlatform): Promise<HeroicFeatCard> {
        let availableCards = countCardsByType(platform.cards.filter(card => card.isAffordableFor(currentPlayer)));
    
        const cardsWithAmountsAvailable =
            Array.from(availableCards.entries())
                .map(([card, amount]) => `${card} (${amount})`).join(' | ');
    
        let chosenCardCode = await CommandLineInterface.questionUntilValidAnswer(game,
            `Which card do you want to buy?`,
            ...Array.from(availableCards.keys()).map(card => card.getCode()));
    
        let chosenCard = platform.cards.find(card => card.getCode() === chosenCardCode.toUpperCase());
    
        assert(chosenCard);
        return chosenCard;
    }
    

    static async chooseResource(game: Game, playerName: string, value: number | null, ...options: string[]): Promise<string>{
        return (await CommandLineInterface.questionUntilValidAnswer(game, `you (${playerName}) want Gold, Moon shards or Sun Shards? ${value !== null ? `(${value})`: ''}`, ...options)).toUpperCase();
    }

    static async howMuchGoldForHammer(game: Game, currentPlayer: Player, value: number): Promise<number>{
        if(currentPlayer.activeHammerCount === 0){
            return 0;
        }
        
        const maxGoldForHammer = currentPlayer.activeHammerCount * 30 - currentPlayer.goldForHammer;


        return parseInt(await CommandLineInterface.questionUntilValidAnswer(game, `
You (${currentPlayer.name}) have ${chalk.yellow(value)} to distribute.
How much would you like to add to the hammer? (0..${maxGoldForHammer < value ? maxGoldForHammer : value})
Everything else will go to your regular gold resource`, '0', ...getArrayOfNumberStringsUpTo(maxGoldForHammer < value ? maxGoldForHammer : value)));
    }

    static async whichDieToRoll(game: Game): Promise<string>{
        return await CommandLineInterface.questionUntilValidAnswer(game, `Do you (${name}) want to roll your Left die or the Right die or Cancel?`, 'R', 'L', 'C').then(answer => answer.toUpperCase());
    }

    static async whichReinforcement(game: Game, availableReinforcements: ReinforcementEffect[]): Promise<string>{
        return CommandLineInterface.questionUntilValidAnswer(game, `
${availableReinforcements.map(r => r.constructor.name).join(',')}        
Which reinforcement do you want to use or Pass?`, 'P', ...availableReinforcements.map(r => r.getCode())).then(answer => answer.toUpperCase());
    }

    private static async questionUntilValidAnswer(game: Game | null, message: string, ...options: string[]): Promise<string> {
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

    private static async question(game: Game | null, message: string): Promise<string> {
        console.clear();
        if (!!game) {
            console.log(`${game}`);
        }
        return new Promise(resolve => { CommandLineInterface.terminal.question(message, resolve); });
    }
}

