import assert from 'assert';
import chalk from 'chalk';
import { cloneDeep } from 'lodash';
import { CostType } from './CostType';
import { Player } from './Player';
import { ResolveMode } from './ResolveMode';
import { CommandLineInterface } from './cli';
import { Die } from './dice/Die';
import { DieFace } from './dice/faces/DieFace';
import { Game } from './game';
import { HeroicFeatCard } from './heroicfeats/HeroicFeatCard';
import { HeroicFeatPlatform } from './heroicfeats/HeroicFeatPlatform';
import { InstantEffect } from './heroicfeats/InstantEffect';
import { ReinforcementEffect } from './heroicfeats/ReinforcementEffect';

export interface fn { (value: number): void }

export function shuffle(array: Array<DieFace>): Array<DieFace> {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export function isInstantEffect(arg: any): arg is InstantEffect {
    return (arg as InstantEffect).handleEffect !== undefined;
}

export function isReinforcementEffect(arg: any): arg is ReinforcementEffect {
    return (arg as ReinforcementEffect).addToListOfReinforcements !== undefined;
}

export function getDieFacesAsPrettyString(name: string, dieFaces: Array<DieFace>): string {
    if (dieFaces === undefined) {
        return '';
    }
    let print = `${name}: `;
    print += toPaddedString(dieFaces, RIGHT_PADDING_LENGTH - print.length);

    return print;
}

export function toPaddedString(dieFaces: Array<DieFace>, paddingLength?: number): string {
    let result = dieFaces.join(', ');
    //styling through chalk messes with length, padding needs to be done manually
    const resultLength = dieFaces.map(face => { return face.unstyledString() }).join(', ').length;
    for (let i = resultLength; i < (paddingLength || RIGHT_PADDING_LENGTH); i++) {
        result += ' ';
    }
    return result;
}

export function getArrayOfNumberStringsUpTo(maxNumber: number, offset: number = 1): Array<string> {
    let options: string[] = new Array();
    for (let i = offset; i <= maxNumber; i++) {
        options.push(i + "");
    }
    return options;
}

export function countCardsByType(cards: Array<HeroicFeatCard>): Map<HeroicFeatCard, number> {
    return cards.reduce((accumulator, currentCard) => pushCard(accumulator, currentCard), new Map<HeroicFeatCard, number>());

    function pushCard(accumulator: Map<HeroicFeatCard, number>, currentCard: HeroicFeatCard): Map<HeroicFeatCard, number> {
        let currentAmount = accumulator.get(currentCard) || 0;
        accumulator.set(currentCard, currentAmount + 1);

        return accumulator;
    }
}

export async function receiveDivineBlessing(game: Game, player: Player, add: boolean = true): Promise<void> {
    let rolls = divineBlessing(player);
    await resolveDieRolls(game, player, rolls, add ? ResolveMode.ADD : ResolveMode.SUBTRACT);
}

export function divineBlessing(player: Player): Array<DieFace> {
    let rolls = new Array<DieFace>;

    rolls.push(player.leftDie.roll());
    rolls.push(player.rightDie.roll());

    return rolls;
}

export async function minorBlessing(game: Game, currentPlayer: Player, die: Die): Promise<void> {
    await resolveDieRolls(game, currentPlayer, new Array(die.roll()), ResolveMode.ADD);
}

export async function resolveRoll(game: Game, currentPlayer: Player, roll: DieFace, mode: ResolveMode, multiplier: number): Promise<void> {
    //TODO: resolve roll based on type with switch case
}

export async function resolveDieRolls(game: Game, currentPlayer: Player, rolls: Array<DieFace>, mode: ResolveMode): Promise<void> {
    await handleMirrorRollsEventually(game, currentPlayer, rolls);

    let multiplier = handleHelmetEventually(rolls);
    multiplier = handleMinotaurEventually(mode, multiplier);

    await rolls.filter(roll => !roll.hasChoice()).reduce((chain, roll) => chain.then(() => roll.resolve(game, currentPlayer, multiplier)), Promise.resolve());
    await rolls.filter(roll => roll.hasChoice()).reduce((chain, roll) => chain.then(() => roll.resolve(game, currentPlayer, multiplier)), Promise.resolve());
}

async function handleMirrorRollsEventually(game: Game, currentPlayer: Player, rolls: Array<DieFace>): Promise<DieFace[]> {
    const allRolls = game.getRollsOfOtherPlayers(currentPlayer);
    while (rolls.some(roll => DieFace.isMirror(roll))) {
        const options = allRolls.filter(roll => !DieFace.isMirror(roll));

        const replacementChoice = await new CommandLineInterface().chooseDieFace(options, game, true)
        const replacementRoll = allRolls.splice(allRolls.findIndex(option => option.is(replacementChoice.code)), 1).at(0);

        assert(replacementRoll);
        rolls.splice(rolls.findIndex(roll => roll.code === 'M'), 1, replacementRoll);
    }

    return rolls;
}

function handleHelmetEventually(rolls: DieFace[]) {
    let multiplier = 1;

    while (rolls.some(roll => DieFace.isHelmet(roll))) {
        rolls.splice(rolls.findIndex(roll => DieFace.isHelmet(roll)), 1);
        multiplier *= 3;
    }
    return multiplier;
}

function handleMinotaurEventually(mode: ResolveMode, multiplier: number) {
    if (mode === ResolveMode.SUBTRACT) {
        multiplier *= -1;
    }
    return multiplier;
}

export async function forge(game: Game, currentPlayer: Player): Promise<void> {
    let userEnd = false;
    let minimumCost = game.sanctuary.lowestAvailablePoolCost(currentPlayer.gold);
    const boughtDieFaces = new Set<DieFace>();

    while (userEnd !== true && minimumCost !== -1) {
        console.clear();
        let bought = await new CommandLineInterface().pickDieFace(game, currentPlayer, boughtDieFaces);

        buyDieFace(game, currentPlayer, bought);
        boughtDieFaces.add(bought);

        const die = await new CommandLineInterface().chooseDieToReplaceDieFace(game, currentPlayer, bought);
        let dieFaceToReplace = await new CommandLineInterface().chooseDieFace(die.faces, game);

        die.replaceFace(dieFaceToReplace, bought, game);

        minimumCost = game.sanctuary.lowestAvailablePoolCost(currentPlayer.gold);

        if (minimumCost !== -1) {
            console.clear();
            userEnd = await new CommandLineInterface().keepForging(game, boughtDieFaces);
        }
    }
}

export function buyDieFace(game: Game, currentPlayer: Player, face: DieFace): void {
    currentPlayer.gold -= face.cost;
    game.sanctuary.removeDieFace(face);
}

export async function heroicFeat(game: Game, currentPlayer: Player): Promise<void> {
    const chosenPlatform = await new CommandLineInterface().pickPlatform(game, currentPlayer);
    await jumpTo(game, currentPlayer, chosenPlatform);

    let card = await new CommandLineInterface().pickCardToBuy(game, currentPlayer, chosenPlatform);
    buyCard(currentPlayer, card, chosenPlatform);

    if (isInstantEffect(card)) {
        await card.handleEffect(game, currentPlayer);
    } else if (isReinforcementEffect(card)) {
        card.addToListOfReinforcements(currentPlayer);
    }
}

async function jumpTo(game: Game, currentPlayer: Player, targetPlatform: HeroicFeatPlatform): Promise<void> {
    await targetPlatform.handleEventualOusting(game, currentPlayer);
    game.heroicFeats.clearPlayerFromItsCurrentPlatform(currentPlayer);
    targetPlatform.player = currentPlayer;
}

function buyCard(currentPlayer: Player, card: HeroicFeatCard, platform: HeroicFeatPlatform): void {
    currentPlayer.heroicFeats.push(card);
    platform.cards.splice(platform.cards.map(c => c.getCode()).lastIndexOf(card.getCode()), 1);

    switch (card.getCostType()) {
        case CostType.MOON: currentPlayer.moon -= card.getCost(); break;
        case CostType.SUN: currentPlayer.sun -= card.getCost(); break;
        case CostType.BOTH: currentPlayer.moon -= card.getCost(); currentPlayer.sun -= card.getCost(); break;
    }
}

export async function doReinforcements(game: Game, currentPlayer: Player): Promise<void> {
    let reinforcementsLeftForTurn = cloneDeep(currentPlayer.reinforcements) as Array<ReinforcementEffect>;
    while (reinforcementsLeftForTurn.length !== 0) {
        console.clear();
        console.log(`${currentPlayer}\n\n${game.sanctuary}\n\n${game.heroicFeats}`);

        const answer = await new CommandLineInterface().whichReinforcement(game, reinforcementsLeftForTurn);

        if (answer === 'P') {
            return;
        } else {
            let currentReinforcement = reinforcementsLeftForTurn.find(reinforcement => reinforcement.getCode() === answer);
            if (currentReinforcement !== undefined) {
                await currentReinforcement.handleReinforcement(game, currentPlayer);
                reinforcementsLeftForTurn.splice(reinforcementsLeftForTurn.findIndex(reinforcement => reinforcement === currentReinforcement), 1);
            }
        }
    }
}

export async function addGoldTo(game: Game, currentPlayer: Player, value: number) {
    const answer = await new CommandLineInterface().howMuchGoldForHammer(game, currentPlayer, value);

    currentPlayer.addGoldToHammer(answer);
    currentPlayer.addGold(value - answer);
}

export const RIGHT_PADDING_LENGTH = 40;