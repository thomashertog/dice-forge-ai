import chalk from 'chalk';
import cloneDeep from 'lodash/cloneDeep';
import { CostType } from './CostType';
import { Die } from './Die';
import { DieFaceOption, printDieFaceOption } from './DieFaceOption';
import { Game } from './Game';
import { HeroicFeatCard } from './heroicfeats/HeroicFeatCard';
import { ReinforcementEffect } from './heroicfeats/ReinforcementEffect';
import { ResolveMode } from './ResolveMode';
import { getArrayOfNumberStringsUpTo, getDieFacesAsPrettyString, isInstantEffect, isReinforcementEffect, questionUntilValidAnswer } from './util';

export class Player {

    private MAX_GOLD = 12;
    private MAX_MOON_SUN = 6;

    leftDie: Die;
    rightDie: Die;
    heroicFeats: Array<HeroicFeatCard>;
    currentPlatform: string;

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
        this.currentPlatform = "";
        this.reinforcements = new Array();

        this.leftDie = new Die(DieFaceOption.SUN_1, DieFaceOption.GOLD_1, DieFaceOption.GOLD_1, DieFaceOption.GOLD_1, DieFaceOption.GOLD_1, DieFaceOption.GOLD_1);

        this.rightDie = new Die(DieFaceOption.MOON_1, DieFaceOption.GP_2, DieFaceOption.GOLD_1, DieFaceOption.GOLD_1, DieFaceOption.GOLD_1, DieFaceOption.GOLD_1);

        this.heroicFeats = new Array();
    }

    toString = () => {
        return `${this.name}\t${getDieFacesAsPrettyString("left", this.leftDie.faces)}\t${getDieFacesAsPrettyString("right", this.rightDie.faces)}\nReinforcements: ${this.reinforcements}\n${this.getResourcesString()}\n${this.heroicFeats}`;
    }

    async receiveDivineBlessing(): Promise<void> {
        let rolls = this.divineBlessing();
        await this.game.resolveDieRolls(this, rolls, ResolveMode.ADD);
    }

    divineBlessing(): Array<DieFaceOption> {
        let rolls = new Array<DieFaceOption>;

        rolls.push(this.leftDie.roll());
        rolls.push(this.rightDie.roll());

        return rolls;
    }

    async minorBlessing(die: Die): Promise<void> {
        await this.game.resolveDieRolls(this, new Array(die.roll()), ResolveMode.ADD);
    }

    async takeTurn(): Promise<void> {
        console.log(`${this}`);
        console.log(`${this.game.sanctuary}`)
        try {
            let answer = (await questionUntilValidAnswer("What do you want to do now? (F) Forge / (H) Heroic feat / (P) Pass", 'F', 'H', 'P')).toUpperCase();
            if (answer === 'F') {
                await this.forge();
            } else if (answer === 'H') {
                await this.heroicFeat();
            }
        } catch (err) {
            console.log(`WTF, something is wrong here\nerr: ${err}`);
        }
    }

    private async heroicFeat(): Promise<void> {
        for (let portal of this.game.heroicFeats.entries()) {
            let platformName = portal[0];
            for (let player of this.game.players) {
                if (player.currentPlatform === portal[0]) {
                    platformName += ` (${player.name})`;
                }
            }
            console.log(`${platformName}: ${portal[1]}`);
        }

        console.log(`available platforms: ${this.availablePlatforms()}`);
        let platform = await (await questionUntilValidAnswer("To which platform do you want to jump?", ...this.availablePlatforms())).toUpperCase();

        await this.handleEventualOusting(platform);

        this.currentPlatform = platform;

        //NOTE: needed for use in filter function
        let currentPlayer = this;

        let allCardsOfPlatform = cloneDeep(this.game.heroicFeats.get(platform)) || [];
        let firstIndex = allCardsOfPlatform?.findIndex(
            function (card: HeroicFeatCard) {
                switch (card.getCostType()) {
                    case CostType.MOON: return currentPlayer.moon >= card.getCost();
                    case CostType.SUN: return currentPlayer.sun >= card.getCost();
                    case CostType.BOTH: return currentPlayer.moon >= card.getCost() && currentPlayer.sun >= card.getCost();
                }
            }
        );

        let lastIndex = allCardsOfPlatform?.length - 1 - allCardsOfPlatform?.reverse().findIndex(
            function (card: HeroicFeatCard) {
                switch (card.getCostType()) {
                    case CostType.MOON: return currentPlayer.moon >= card.getCost();
                    case CostType.SUN: return currentPlayer.sun >= card.getCost();
                    case CostType.BOTH: return currentPlayer.moon >= card.getCost() && currentPlayer.sun >= card.getCost();
                }
            }
        );

        let chosenCardNumber = parseInt(await questionUntilValidAnswer(`Which card do you want to buy (${firstIndex + 1}..${lastIndex + 1})`, ...getArrayOfNumberStringsUpTo(lastIndex + 1, firstIndex + 1)));

        let chosenCard = this.game.heroicFeats.get(platform)?.splice(chosenCardNumber - 1, 1)[0];
        if (chosenCard === undefined) {
            return;
        }
        console.log(`${chosenCard}`);
        this.heroicFeats.push(chosenCard);
        switch (chosenCard.getCostType()) {
            case CostType.MOON: this.moon -= chosenCard.getCost(); break;
            case CostType.SUN: this.sun -= chosenCard.getCost(); break;
            case CostType.BOTH: this.moon -= chosenCard.getCost(); this.sun -= chosenCard.getCost(); break;
        }

        if (isInstantEffect(chosenCard)) {
            await chosenCard.handleEffect(this);
        }
        if (isReinforcementEffect(chosenCard)) {
            chosenCard.addToListOfReinforcements(currentPlayer);
        }
    }

    private async handleEventualOusting(platform: string): Promise<void> {
        for (let player of this.game.players) {
            if (player === this) {
                continue;
            }
            if (player.currentPlatform.toUpperCase() === platform) {
                console.log(`ousting ${player.name}`);
                player.currentPlatform = "";
                await player.receiveDivineBlessing();
            }
        }
    }

    private availablePlatforms(): Array<string> {
        //NOTE: filter platforms that aren't available because all the cheapest cards are sold out
        let platforms = new Array();
        if (this.moon >= 1) {
            platforms.push("M1");
        }
        if (this.moon >= 2) {
            platforms.push("M2");
        }
        if (this.moon >= 4) {
            platforms.push("M3");
        }
        if (this.sun >= 1) {
            platforms.push("S1");
        }
        if (this.sun >= 2) {
            platforms.push("S2");
        }
        if (this.sun >= 4) {
            platforms.push("S3");
        }
        if ((this.sun >= 5 && this.moon >= 5) || this.sun >= 6 || this.moon >= 6) {
            platforms.push("E");
        }
        return platforms;
    }

    async doReinforcements(): Promise<void> {
        let reinforcementsLeftForTurn = cloneDeep(this.reinforcements) as Array<ReinforcementEffect>;
        while (reinforcementsLeftForTurn.length !== 0) {
            let restring = reinforcementsLeftForTurn.map(reinforcement => reinforcement.toString()).join(',');
            let answer = await questionUntilValidAnswer(`${this.getResourcesString()}\nyou currently have these reinforcements available\n${restring}\nWhich one do you want to use (1...${reinforcementsLeftForTurn.length}) or pass (P)`, ...getArrayOfNumberStringsUpTo(reinforcementsLeftForTurn.length), 'P');

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
        let usedPools = new Array();

        while (userEnd !== true && minimumCost !== -1) {
            console.log(`${this.game.sanctuary}`);
            usedPools.push(await this.buyAndReplaceDieFace(usedPools));
            minimumCost = this.game.sanctuary.lowestAvailablePoolCost(this.gold);

            if (minimumCost !== -1) {
                let continueForging = await questionUntilValidAnswer(`You have ${chalk.yellow(this.gold)}\nDo you want to keep forging? (Y/N)`, 'Y', 'N');
                if (continueForging.toUpperCase() === 'N') {
                    userEnd = true;
                }
            }
        }

    }

    private async buyAndReplaceDieFace(usedPools: Array<number>): Promise<number> {
        let availablePoolNumbers = this.game.sanctuary.availablePoolNumbers(this.gold)
            .filter(poolNumber => !usedPools.includes(poolNumber));

        let chosenPoolNumber = parseInt(
            await questionUntilValidAnswer(
                `out of which pool are you going to buy (${availablePoolNumbers})?`,
                ...availablePoolNumbers.map(poolNumber => poolNumber + "")));

        let chosenPool = this.game.sanctuary.pools[chosenPoolNumber - 1];
        const numberOfOptionsInPool = chosenPool.dieFaces.length;

        let buyChoice = parseInt(await questionUntilValidAnswer(`which dieface do you want? (1..${numberOfOptionsInPool})`, ...getArrayOfNumberStringsUpTo(numberOfOptionsInPool)));

        let boughtDieFace = chosenPool.dieFaces[buyChoice - 1];
        console.log(`congrats you bought ${printDieFaceOption(boughtDieFace)}`);

        let die = await this.chooseDieToReplaceDieFace(boughtDieFace);
        await die.replaceFace(boughtDieFace);

        this.gold -= chosenPool.cost;
        chosenPool.dieFaces.splice(buyChoice - 1, 1);
        return chosenPoolNumber;
    }

    async chooseDieToReplaceDieFace(bought: DieFaceOption): Promise<Die> {
        let leftRight = await (await questionUntilValidAnswer(`${getDieFacesAsPrettyString('left', this.leftDie.faces)}\t${getDieFacesAsPrettyString('right', this.rightDie.faces)}\non which die you want to forge ${printDieFaceOption(bought)}? Left (L) or Right (R)`, 'R', 'L')).toUpperCase();
        if (leftRight === 'R') {
            return new Promise(resolve => resolve(this.rightDie));
        } else if (leftRight === 'L') {
            return new Promise(resolve => resolve(this.leftDie));
        } else {
            return new Promise((resolve, reject) => reject);
        }
    }

    async addGold(value: number): Promise<void> {
        if (this.activeHammerCount > 0 && value > 0) {
            let goldForHammerBeforeAdding = this.goldForHammer;
            let maxGoldForHammer = this.activeHammerCount * 30 - this.goldForHammer;

            let answer = parseInt(await questionUntilValidAnswer(`you have ${value} gold to distribute\nyour hammer already contains ${this.goldForHammer % 30}\nyour current treasure contains ${this.gold}/${this.MAX_GOLD}\nhow much would you like to add to the hammer? (0..${maxGoldForHammer < value ? maxGoldForHammer : value})\nEverything else will go to your regular gold resource`, '0', ...getArrayOfNumberStringsUpTo(maxGoldForHammer < value ? maxGoldForHammer : value)));
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
}