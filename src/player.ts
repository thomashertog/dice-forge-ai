import assert from 'assert';
import chalk from 'chalk';
import cloneDeep from 'lodash/cloneDeep';
import { CostType } from './CostType';
import { Game } from './game';
import { ResolveMode } from './ResolveMode';
import { Die } from './dice/Die';
import { BuyableDieFace, isBuyableDieFace } from './dice/faces/BuyableDieFace';
import { DieFace } from './dice/faces/DieFace';
import { GloryPoints2 } from './dice/faces/GloryPoints2';
import { Gold1 } from './dice/faces/Gold1';
import { Moon1 } from './dice/faces/Moon1';
import { Sun1 } from './dice/faces/Sun1';
import { HeroicFeatCard } from './heroicfeats/HeroicFeatCard';
import { HeroicFeatPlatform } from './heroicfeats/HeroicFeatPlatform';
import { ReinforcementEffect } from './heroicfeats/ReinforcementEffect';
import { RIGHT_PADDING_LENGTH, chooseDieFace, countCardsByType, getArrayOfNumberStringsUpTo, getDieFacesAsPrettyString, isInstantEffect, isReinforcementEffect, questionUntilValidAnswer } from './util';

export class Player {

    private MAX_GOLD = 12;
    private MAX_MOON_SUN = 6;

    leftDie: Die;
    rightDie: Die;
    heroicFeats: Array<HeroicFeatCard>;

    reinforcements: Array<ReinforcementEffect>;

    name: string;
    activeHammerCount: number;
    goldForHammer: number;
    gold: number;
    moon: number;
    sun: number;
    gloryPoints: number;

    game: Game;

    constructor(initialGold: number, game: Game, name: string) {
        this.name = name;
        this.game = game;
        this.activeHammerCount = 0;
        this.goldForHammer = 0;
        this.gold = initialGold;
        this.sun = 0;
        this.moon = 0;
        this.gloryPoints = 0;
        this.reinforcements = new Array();

        this.leftDie = new Die(new Sun1(), new Gold1(), new Gold1(), new Gold1(), new Gold1(), new Gold1());

        this.rightDie = new Die(new Moon1(), new GloryPoints2(), new Gold1(), new Gold1(), new Gold1(), new Gold1());

        this.heroicFeats = new Array();
    }

    toString(): string {
        return this.getPrettyPrint();
    }

    getPrettyPrint(currentRoundNumber?: number, countGameRounds?: number): string {
        return `
${this.name}    ${currentRoundNumber !== undefined ? `Round: ${currentRoundNumber}/${countGameRounds}` : ''}
-----------------------
${getDieFacesAsPrettyString("left", this.leftDie.faces, false)}    ${getDieFacesAsPrettyString("right", this.rightDie.faces, false)}
${this.getResourcesString()}
Reinforcements: ${this.reinforcements}
`;
    }

    async receiveDivineBlessing(): Promise<void> {
        let rolls = this.divineBlessing();
        await this.resolveDieRolls(rolls, ResolveMode.ADD);
    }

    divineBlessing(): Array<DieFace> {
        let rolls = new Array<DieFace>;

        rolls.push(this.leftDie.roll());
        rolls.push(this.rightDie.roll());

        return rolls;
    }

    async minorBlessing(die: Die): Promise<void> {
        await this.resolveDieRolls(new Array(die.roll()), ResolveMode.ADD);
    }

    async takeTurn(): Promise<boolean> {
        try {
            let answer = (await questionUntilValidAnswer(this.game, "What do you want to do now? Forge / Heroic feat / Pass", 'F', 'H', 'P')).toUpperCase();
            if (answer === 'F') {
                await this.forge();
            } else if (answer === 'H') {
                await this.heroicFeat();
            } else if (answer === 'P') {
                return new Promise(resolve => resolve(false));
            }
        } catch (err) {
            console.log(`WTF, something is wrong here\nerr: ${err}`);
        }
        return new Promise(resolve => resolve(true));
    }

    private async heroicFeat(): Promise<void> {
        let chosenPlatform = await this.pickPlatform();
        await this.jumpTo(chosenPlatform);

        let card = await this.pickCardToBuy(chosenPlatform);
        this.buyCard(card, chosenPlatform);

        if (isInstantEffect(card)) {
            await card.handleEffect(this);
        } else if (isReinforcementEffect(card)) {
            card.addToListOfReinforcements(this);
        }
    }

    private async pickPlatform(): Promise<HeroicFeatPlatform> {
        let platformChoice = await (await questionUntilValidAnswer(this.game, "To which platform do you want to jump?", ...this.game.heroicFeats.availablePlatformsFor(this))).toUpperCase();

        let platform = this.game.heroicFeats.platforms.find(platform => platform!.code === platformChoice);
        assert(platform);

        return platform;
    }

    async jumpTo(targetPlatform: HeroicFeatPlatform): Promise<void> {
        await targetPlatform.handleEventualOusting(this);
        this.game.heroicFeats.clearPlayerFromItsCurrentPlatform(this);
        targetPlatform.player = this;
    }

    private async pickCardToBuy(platform: HeroicFeatPlatform): Promise<HeroicFeatCard> {
        let availableCards = countCardsByType(platform.cards.filter(card => card.isAffordableFor(this)));

        const cardsWithAmountsAvailable =
            Array.from(availableCards.entries())
                .map(([card, amount]) => `${card} (${amount})`).join(' | ');

        let chosenCardCode = await questionUntilValidAnswer(this.game, 
            `Which card do you want to buy?`,
            ...Array.from(availableCards.keys()).map(card => card.getCode()));

        let chosenCard = platform.cards.find(card => card.getCode() === chosenCardCode.toUpperCase());

        assert(chosenCard);
        return chosenCard;
    }

    buyCard(card: HeroicFeatCard, platform: HeroicFeatPlatform): void {
        this.heroicFeats.push(card);
        platform.cards.splice(platform.cards.map(c => c.getCode()).lastIndexOf(card.getCode()), 1);

        switch (card.getCostType()) {
            case CostType.MOON: this.moon -= card.getCost(); break;
            case CostType.SUN: this.sun -= card.getCost(); break;
            case CostType.BOTH: this.moon -= card.getCost(); this.sun -= card.getCost(); break;
        }
    }

    async doReinforcements(): Promise<void> {
        let reinforcementsLeftForTurn = cloneDeep(this.reinforcements) as Array<ReinforcementEffect>;
        while (reinforcementsLeftForTurn.length !== 0) {
            console.clear();
            console.log(`${this}\n\n${this.game.sanctuary}\n\n${this.game.heroicFeats}`);

            let reinforcements = reinforcementsLeftForTurn
                .map(reinforcement => reinforcement.constructor.name)
                .join(',');
            let answer = await (await questionUntilValidAnswer(this.game, 
`
${reinforcements}
Which reinforcement do you want to use or pass`,
                ...reinforcementsLeftForTurn.map(reinforcement => reinforcement.getCode()), 'P')).toUpperCase();

            if (answer === 'P') {
                return;
            } else {
                let currentReinforcement = reinforcementsLeftForTurn.find(reinforcement => reinforcement.getCode() === answer);
                if (currentReinforcement !== undefined) {
                    await currentReinforcement.handleReinforcement(this);
                    reinforcementsLeftForTurn.splice(reinforcementsLeftForTurn.findIndex(reinforcement => reinforcement === currentReinforcement), 1);
                }
            }
        }
    }

    private async forge(): Promise<void> {
        let userEnd = false;
        let minimumCost = this.game.sanctuary.lowestAvailablePoolCost(this.gold);
        let boughtDieFaces = new Set<BuyableDieFace>();

        while (userEnd !== true && minimumCost !== -1) {
            console.clear();
            let bought = await this.pickDieFace(boughtDieFaces);

            if (isBuyableDieFace(bought)) {
                this.buyDieFace(bought);
                boughtDieFaces.add(bought);
                await this.placeDieFaceOntoDie(bought);
            }

            minimumCost = this.game.sanctuary.lowestAvailablePoolCost(this.gold);

            if (minimumCost !== -1) {
                console.clear();
                let continueForging = await questionUntilValidAnswer(this.game, `
You already bought: ${getDieFacesAsPrettyString("", Array.from(boughtDieFaces), false)}\n
Do you want to keep forging? (Y/N)`,
                    'Y', 'N');

                if (continueForging.toUpperCase() === 'N') {
                    userEnd = true;
                }
            }
        }
    }

    private async pickDieFace(boughtDieFaces: Set<BuyableDieFace>): Promise<BuyableDieFace> {
        let buyableFaces = this.game.sanctuary.buyableDieFacesFor(this.gold, boughtDieFaces);

        let buy = await (await questionUntilValidAnswer(this.game, `
you have ${chalk.yellow(this.gold)} to spend
which die face are you going to buy?`,
            ...buyableFaces.map(dieface => dieface.code))).toUpperCase();

        let dieFace = buyableFaces.find(face => face.is(buy));
        assert(dieFace);
        return dieFace;
    }

    buyDieFace(face: BuyableDieFace): void {
        this.gold -= face.getCost();
        this.game.sanctuary.removeDieFace(face);
    }

    async placeDieFaceOntoDie(replacement: DieFace): Promise<void> {
        let die = await this.chooseDieToReplaceDieFace(replacement);
        await die.replaceFace(replacement, this.game);
    }

    private async chooseDieToReplaceDieFace(bought: DieFace): Promise<Die> {
        let leftRight = (await questionUntilValidAnswer(this.game, `on which die you want to forge ${bought}? Left or Right`,
            'R', 'L'))
            .toUpperCase();

        if (leftRight === 'R') {
            return new Promise(resolve => resolve(this.rightDie));
        } else if (leftRight === 'L') {
            return new Promise(resolve => resolve(this.leftDie));
        } else {
            return new Promise((_resolve, reject) => reject);
        }
    }

    async addGold(value: number): Promise<void> {
        if (this.activeHammerCount > 0 && value > 0) {
            let goldForHammerBeforeAdding = this.goldForHammer;
            let maxGoldForHammer = this.activeHammerCount * 30 - this.goldForHammer;

            let answer = parseInt(await questionUntilValidAnswer(this.game, `
you (${this.name}) have ${chalk.yellow(value)} to distribute
how much would you like to add to the hammer? (0..${maxGoldForHammer < value ? maxGoldForHammer : value})
Everything else will go to your regular gold resource`,
                '0', ...getArrayOfNumberStringsUpTo(maxGoldForHammer < value ? maxGoldForHammer : value)));
            this.gold += value - answer;
            this.goldForHammer += value - (value - answer);
            if (answer > 0 && this.goldForHammer % 30 === 0) {
                this.activeHammerCount -= 1;
                this.goldForHammer -= 30;
                this.addGloryPoints(15);
            }
            if (goldForHammerBeforeAdding < 15 && this.goldForHammer >= 15) {
                this.addGloryPoints(10);
            }
        } else {
            this.gold += value;
        }
        if (this.gold > this.MAX_GOLD) {
            this.gold = this.MAX_GOLD;
        }
        if (this.gold < 0) {
            this.gold = 0;
        }
    }

    addSun(value: number): void {
        this.sun += value;
        if (this.sun > this.MAX_MOON_SUN) {
            this.sun = this.MAX_MOON_SUN;
        }
        if (this.sun < 0) {
            this.sun = 0
        }
    }

    addMoon(value: number): void {
        this.moon += value;
        if (this.moon > this.MAX_MOON_SUN) {
            this.moon = this.MAX_MOON_SUN;
        }
        if (this.moon < 0) {
            this.moon = 0;
        }
    }

    addGloryPoints(value: number): void {
        this.gloryPoints += value;
        if (this.gloryPoints < 0) {
            this.gloryPoints = 0;
        }
    }

    getResourcesString(usePadding?: boolean): string {
        let resources = [`${chalk.yellow(this.gold)}/${chalk.yellow(this.MAX_GOLD)}`,
        `${chalk.blueBright(this.moon)}/${chalk.blueBright(this.MAX_MOON_SUN)}`,
        `${chalk.red(this.sun)}/${chalk.red(this.MAX_MOON_SUN)}`,
        `${chalk.green(this.gloryPoints)}`];

        if (this.activeHammerCount > 0) {
            resources.push(`H: ${chalk.yellow(this.goldForHammer)}/${chalk.yellow(30)}`);
        }

        let result = resources.join('  ');

        if (!!usePadding) {
            let unstyledResources = [this.gold + '/' + this.MAX_GOLD, this.moon + '/' + this.MAX_MOON_SUN, this.sun + '/' + this.MAX_MOON_SUN, this.gloryPoints];

            if (this.activeHammerCount > 0) {
                unstyledResources.push(`H: ${this.goldForHammer}/30`);
            }
            
            const resultLength = unstyledResources.join('  ').length;
            for (let i = resultLength; i < RIGHT_PADDING_LENGTH; i++) {
                result += ' ';
            }
        }

        return result;
    }

    extraChest(): void {
        this.MAX_GOLD += 4;
        this.MAX_MOON_SUN += 3;
    }

    async resolveDieRolls(rolls: Array<DieFace>, mode: ResolveMode): Promise<void> {
        await this.handleMirrorRollsEventually(rolls);

        let multiplier = this.handleHelmetEventually(rolls);
        multiplier = this.handleMinotaurEventually(mode, multiplier);

        await rolls.filter(roll => !roll.hasChoice()).reduce((chain, roll) => chain.then(() => roll.resolve(this, multiplier)), Promise.resolve());
        await rolls.filter(roll => roll.hasChoice()).reduce((chain, roll) => chain.then(() => roll.resolve(this, multiplier)), Promise.resolve());
    }

    private handleMinotaurEventually(mode: ResolveMode, multiplier: number) {
        if (mode === ResolveMode.SUBTRACT) {
            multiplier *= -1;
        }
        return multiplier;
    }

    private handleHelmetEventually(rolls: DieFace[]) {
        let multiplier = 1;

        while (rolls.some(roll => DieFace.isHelmet(roll))) {
            rolls.splice(rolls.findIndex(roll => DieFace.isHelmet(roll)), 1);
            multiplier *= 3;
        }
        return multiplier;
    }

    async handleMirrorRollsEventually(rolls: Array<DieFace>): Promise<DieFace[]> {
        if (rolls.some(roll => DieFace.isMirror(roll))) {
            let allRolls = new Array<DieFace>;
            this.game.players.filter(player => player !== this)
                .map(player => allRolls.push(player.leftDie.faces[0], player.rightDie.faces[0]));

            let options = allRolls?.filter(roll => !DieFace.isMirror(roll));

            const replacementChoice = await chooseDieFace(options, this.game, true)

            let replacementRoll = allRolls.find(option => option.is(replacementChoice.code)) as DieFace;

            return rolls.splice(rolls.findIndex(roll => roll.code === 'M'), 1, replacementRoll);
        }

        return rolls;
    }
}