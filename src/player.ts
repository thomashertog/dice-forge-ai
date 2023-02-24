import assert from 'assert';
import chalk from 'chalk';
import { result } from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import { CostType } from './CostType';
import { Die } from './dice/Die';
import { DieFace } from './dice/faces/DieFace';
import { GloryPoints2 } from './dice/faces/GloryPoints2';
import { Gold1 } from './dice/faces/Gold1';
import { Moon1 } from './dice/faces/Moon1';
import { Sun1 } from './dice/faces/Sun1';
import { Game } from './Game';
import { HeroicFeatCard } from './heroicfeats/HeroicFeatCard';
import { HeroicFeatPlatform } from './heroicfeats/HeroicFeatPlatform';
import { ReinforcementEffect } from './heroicfeats/ReinforcementEffect';
import { ResolveMode } from './ResolveMode';
import { chooseDieFace, countCardsByType, getArrayOfNumberStringsUpTo, getDieFacesAsPrettyString, isInstantEffect, isReinforcementEffect, questionUntilValidAnswer } from './util';

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
        return `
        ${this.name}
        -----------------------
        ${getDieFacesAsPrettyString("left", this.leftDie.faces)}    ${getDieFacesAsPrettyString("right", this.rightDie.faces)}
        ${this.getResourcesString()}
        Reinforcements: ${this.reinforcements}`;
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
        console.log(`${this}`);
        console.log(`${this.game.sanctuary}`)
        console.log(`${this.game.heroicFeats}`)
        try {
            let answer = (await questionUntilValidAnswer("What do you want to do now? (F) Forge / (H) Heroic feat / (P) Pass", 'F', 'H', 'P')).toUpperCase();
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

    async jumpTo(targetPlatform: HeroicFeatPlatform): Promise<void> {
        await targetPlatform.handleEventualOusting();
        this.game.heroicFeats.clearPlayerFromItsCurrentPlatform(this);
        targetPlatform.player = this;
    }

    buyCard(card: HeroicFeatCard, platform: HeroicFeatPlatform): void {
        this.heroicFeats.push(card);
        platform.cards.splice(platform.cards.findIndex(c => c.getCode() === card.getCode()), 1);

        switch (card.getCostType()) {
            case CostType.MOON: this.moon -= card.getCost(); break;
            case CostType.SUN: this.sun -= card.getCost(); break;
            case CostType.BOTH: this.moon -= card.getCost(); this.sun -= card.getCost(); break;
        }
    }

    private async heroicFeat(): Promise<void> {
        let chosenPlatform = await this.pickPlatform();
        await this.jumpTo(chosenPlatform);

        let card = await this.pickCardToBuy(chosenPlatform);
        this.buyCard(card, chosenPlatform);

        if (isInstantEffect(card)) {
            await card.handleEffect(this);
        }else if(isReinforcementEffect(card)) {
            card.addToListOfReinforcements(this);
        }
    }

    private async pickPlatform(): Promise<HeroicFeatPlatform> {
        console.log(this.game.heroicFeats.toString());
        let platformChoice = await (await questionUntilValidAnswer("To which platform do you want to jump?", ...this.game.heroicFeats.availablePlatformsFor(this))).toUpperCase();

        let platform = this.game.heroicFeats.platforms.find(platform => platform!.code === platformChoice);
        assert(platform);

        return platform;
    }

    private async pickCardToBuy(platform: HeroicFeatPlatform): Promise<HeroicFeatCard> {
        let availableCards = countCardsByType(platform.cards.filter(card => isBuyable(this, card)));

        let chosenCardCode = await questionUntilValidAnswer(
            `Which card do you want to buy
            ${Array.from(availableCards.entries())
                    .reduce((cardsString, [card, amount]) => cardsString += `${card} (${amount})`, "")}`, 
            ...Array.from(availableCards.keys()).map(card => card.getCode()));

        let chosenCard = platform.cards.find(card => card.getCode() === chosenCardCode.toUpperCase());

        assert(chosenCard);
        return chosenCard;
    }

    async doReinforcements(): Promise<void> {
        let reinforcementsLeftForTurn = cloneDeep(this.reinforcements) as Array<ReinforcementEffect>;
        while (reinforcementsLeftForTurn.length !== 0) {
            let restring = reinforcementsLeftForTurn
                .map(reinforcement => reinforcement.toString())
                .join(',');
            let answer = await questionUntilValidAnswer(
                `${this.getResourcesString()}
                you currently have these reinforcements available
                ${restring}
                Which one do you want to use (1...${reinforcementsLeftForTurn.length}) or pass (P)`,
                ...getArrayOfNumberStringsUpTo(reinforcementsLeftForTurn.length), 'P');

            if (answer.toUpperCase() === 'P') {
                return;
            }

            let chosenReinforcement = parseInt(answer);
            if (await reinforcementsLeftForTurn[chosenReinforcement - 1].handleReinforcement(this)) {
                reinforcementsLeftForTurn.splice(chosenReinforcement - 1, 1);
            }
        }
    }

    private async forge(): Promise<void> {
        let userEnd = false;
        let minimumCost = this.game.sanctuary.lowestAvailablePoolCost(this.gold);
        let boughtDieFaces = new Array();

        while (userEnd !== true && minimumCost !== -1) {
            let bought = await this.buyDieFace(boughtDieFaces);
            boughtDieFaces.push(bought);

            await this.placeDieFaceOntoDie(bought);

            minimumCost = this.game.sanctuary.lowestAvailablePoolCost(this.gold);

            if (minimumCost !== -1) {
                let continueForging = await questionUntilValidAnswer(`
                You have ${chalk.yellow(this.gold)}
                Do you want to keep forging? (Y/N)`,
                    'Y', 'N');

                if (continueForging.toUpperCase() === 'N') {
                    userEnd = true;
                }
            }
        }
    }

    private async buyDieFace(boughtDieFaces: Array<DieFace>): Promise<DieFace> {
        let availablePools = this.game.sanctuary.availablePools(this.gold, boughtDieFaces);

        availablePools.map((pool, index) => console.log(`(${index + 1}) -> ${pool}`));

        //TODO: find a way to do this without poolNumber as a separate variable
        let poolNumber = parseInt(await questionUntilValidAnswer(`
        you have ${chalk.yellow(this.gold)} to spend
        out of which pool are you going to buy (${availablePools.map((_pool, index) => index + 1)})?`,
            ...availablePools.map((_pool, index) => index + 1 + "")));
        let pool = availablePools[poolNumber - 1];

        let buy = await chooseDieFace(pool.dieFaces);
        this.gold -= pool.cost;

        pool.dieFaces.splice(pool.dieFaces.findIndex(face => face.is(buy.code)), 1);

        return buy;
    }

    async placeDieFaceOntoDie(replacement: DieFace): Promise<void> {
        let die = await this.chooseDieToReplaceDieFace(replacement);
        await die.replaceFace(replacement);
    }

    private async chooseDieToReplaceDieFace(bought: DieFace): Promise<Die> {
        let leftRight = (await questionUntilValidAnswer(
            `${getDieFacesAsPrettyString('left', this.leftDie.faces)}
            ${getDieFacesAsPrettyString('right', this.rightDie.faces)}
            on which die you want to forge ${bought}?
            Left (L) or Right (R)`,
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

            let answer = parseInt(await questionUntilValidAnswer(`
            you have ${value} gold to distribute
            your hammer already contains ${this.goldForHammer % 30}
            your current treasure contains ${this.gold}/${this.MAX_GOLD}
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
            if (goldForHammerBeforeAdding < 15 && this.goldForHammer > 15) {
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

    getResourcesString(): string {
        return `${chalk.yellow(this.gold)}/${chalk.yellow(this.MAX_GOLD)}, ${chalk.blue(this.moon)}/${chalk.blue(this.MAX_MOON_SUN)}, ${chalk.red(this.sun)}/${chalk.red(this.MAX_MOON_SUN)}, ${chalk.green(this.gloryPoints)}`;
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

            console.log(`your current resources are ${this.getResourcesString()}`);

            const replacementChoice = await chooseDieFace(options)

            let replacementRoll = allRolls.find(option => option.is(replacementChoice.code)) as DieFace;

            return rolls.splice(rolls.findIndex(roll => roll.code === 'M'), 1, replacementRoll);
        }

        return rolls;
    }
}

function isBuyable(currentPlayer: Player, card: HeroicFeatCard): boolean {
    switch (card.getCostType()) {
        case CostType.MOON: return currentPlayer.moon >= card.getCost();
        case CostType.SUN: return currentPlayer.sun >= card.getCost();
        case CostType.BOTH: return currentPlayer.moon >= card.getCost() && currentPlayer.sun >= card.getCost();
    }
}
