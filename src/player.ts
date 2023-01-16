import chalk from 'chalk';
import { reject } from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import { resolve } from 'path';
import { CostType } from './costType';
import { Die } from './Die';
import { DieFaceOption, printDieFaceOption } from './diefaceoption';
import { Game } from './game';
import { HeroicFeatCard } from './heroicfeats/HeroicFeatCard';
import { ReinforcementEffect } from './heroicfeats/ReinforcementEffect';
import { getArrayOfNumberStringsUpTo, getDieFacesAsPrettyString, isInstantEffect, isReinforcementEffect, questionUntilValidAnswer, shuffle } from './util';
        
export class Player {
    
    private MAX_GOLD = 12;
    private MAX_MOON_SUN = 6;

    leftDie: Die;
    rightDie: Die;
    heroicFeats: Array<HeroicFeatCard>;
    currentPlatform: string;

    reinforcements: Array<ReinforcementEffect>;

    name: string;
    gold: number;
    moon: number;
    sun: number;
    gloryPoints: number;

    game: Game;

    constructor(initialGold: number, game: Game, name: string) {
        this.name = name;
        this.game = game;
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

    async divineBlessing(): Promise<void> {
        let rolls = new Array<DieFaceOption>();
        rolls.push(this.leftDie.roll());
        rolls.push(this.rightDie.roll());
        await Game.resolveDieRolls(this, rolls);
    }

    async minorBlessing(die: Die): Promise<void> {
        await Game.resolveDieRolls(this, new Array(die.roll()));
    }

    takeTurn = async () => {
        console.log(`${this}`);
        try {
            let answer = await (await questionUntilValidAnswer("What do you want to do now? (F) Forge / (H) Heroic feat", 'F', 'H')).toUpperCase();
            if(answer === 'F'){
                await this.forge();
            }else if(answer === 'H'){
                await this.heroicFeat();
            }
        } catch (err) {
            console.log(`WTF, something is wrong here\nerr: ${err}`);
        }
    }

    private async heroicFeat(): Promise<void>{
        for(let portal of this.game.heroicFeats.entries()){
            let platformName = portal[0];
            for(let player of this.game.players){
                if(player.currentPlatform === portal[0]){
                    platformName += ` (${player.name})`;
                }
            }
            console.log(`${platformName}: ${portal[1]}`);
        }

        console.log(`available platforms: ${this.availablePlatforms()}`);
        let platform = await (await questionUntilValidAnswer("To which platform do you want to jump?", ...this.availablePlatforms())).toUpperCase();

        for(let player of this.game.players){
            if(player === this){
                continue;
            }
            if(player.currentPlatform.toUpperCase() === platform){
                console.log(`ousting ${player.name}`);
                player.currentPlatform = "";
                player.divineBlessing();
            }
        }

        this.currentPlatform = platform;

        //NOTE: needed for use in filter function
        let currentPlayer = this;

        let cards = this.game.heroicFeats.get(platform)?.filter(
            function(card: HeroicFeatCard){
                switch(card.getCostType()){
                    case CostType.MOON: return currentPlayer.moon >= card.getCost();
                    case CostType.SUN: return currentPlayer.sun >= card.getCost();
                    case CostType.BOTH: return currentPlayer.moon >= card.getCost() && currentPlayer.sun >= card.getCost();        
                }
            }
        );

        let chosenCardNumber = parseInt(await questionUntilValidAnswer(`Which card do you want to buy (1..${cards?.length})`, ...getArrayOfNumberStringsUpTo(cards?.length || 0)));
        let chosenCard = this.game.heroicFeats.get(platform)?.splice(chosenCardNumber - 1, 1)[0];
        if(chosenCard === undefined){
            return;
        }
        console.log(`${chosenCard}`);
        this.heroicFeats.push(chosenCard);
        switch(chosenCard.getCostType()){
            case CostType.MOON: this.moon -= chosenCard.getCost(); break;
            case CostType.SUN: this.sun -= chosenCard.getCost(); break;
            case CostType.BOTH: this.moon -= chosenCard.getCost(); this.sun -= chosenCard.getCost(); break;
        }

        if(isInstantEffect(chosenCard)){
            console.log(chalk.bgGrey(`${chosenCard} has an instant effect`));
            chosenCard.handleEffect(this);
        }
        if(isReinforcementEffect(chosenCard)){
            console.log(chalk.bgGrey(`${chosenCard} has a reinforcement effect`));
            chosenCard.addToListOfReinforcements(currentPlayer);
        }
    }

    private availablePlatforms(): Array<string>{
        let platforms = new Array();
        if(this.moon >= 1){
            platforms.push("M1");
        }
        if(this.moon >= 2){
            platforms.push("M2");
        }
        if(this.moon >= 4){
            platforms.push("M3");
        }
        if(this.sun >= 1){
            platforms.push("S1");
        }
        if(this.sun >= 2){
            platforms.push("S2");
        }
        if(this.sun >= 4){
            platforms.push("S3");
        }
        if((this.sun >= 5 && this.moon >= 5) || this.sun >= 6 || this.moon >= 6){
            platforms.push("E");
        }
        return platforms;
    }

    async doReinforcements(): Promise<void> {
        let reinforcementsLeftForTurn = cloneDeep(this.reinforcements) as Array<ReinforcementEffect>;
        while(reinforcementsLeftForTurn.length !== 0){
            let restring = reinforcementsLeftForTurn.map(reinforcement => reinforcement.toString()).join(',');
            let answer = await questionUntilValidAnswer(`${this.getResourcesString()}\nyou currently have these reinforcements available\n${restring}\nWhich one do you want to use (1...${reinforcementsLeftForTurn.length}) or pass (P)`, ...getArrayOfNumberStringsUpTo(reinforcementsLeftForTurn.length), 'P');

            if(answer.toUpperCase() === 'P'){
                return;
            }

            let chosenReinforcment = parseInt(answer);
            if(await reinforcementsLeftForTurn[chosenReinforcment-1].handleReinforcement(this)){
                reinforcementsLeftForTurn.splice(chosenReinforcment-1, 1);
            }
        }
    }

    private async forge(): Promise<void>{
        let userEnd = false;
        let minimumCost = this.lowestAvailableCost();
        let usedPools = new Array();

        while(userEnd !== true && (minimumCost !== -1 && this.gold >= minimumCost)){
            this.printSanctuary();
            usedPools.push(await this.buyAndReplaceDieFace(usedPools));
            minimumCost = this.lowestAvailableCost();

            let continueForging = await questionUntilValidAnswer(`You have ${chalk.yellow(this.gold)}\nDo you want to keep forging? (Y/N)`, 'Y', 'N');
            if (continueForging.toUpperCase() === 'N') {
                userEnd = true;
            }
        }

    }

    private lowestAvailableCost(): number{
        for(let pool of this.game.sanctuary){
            if(pool.dieFaces.length > 0){
                return pool.cost;
            }
        }
        return -1;
    }

    private highestAffordablePool(): number{
        let reversedSanctuary = [...this.game.sanctuary].reverse();
        
        for(let pool of reversedSanctuary){
            if(pool.dieFaces.length > 0 && pool.cost <= this.gold){
                return this.game.sanctuary.indexOf(pool) +1;
            }
        }
        return 0;
    }

    private printSanctuary() {
        console.log(`so you want to forge, right, go ahead, you have ${this.gold} gold to spend`);
        for (let dieFacePool of this.game.sanctuary) {
            console.log(`${chalk.yellow(dieFacePool.cost)}: ${getDieFacesAsPrettyString("", dieFacePool.dieFaces)}`);
        }
    }

    private async buyAndReplaceDieFace(usedPools: Array<number>): Promise<number> {
        let maxPoolNumber = this.highestAffordablePool();
        
        let pool = parseInt(
            await questionUntilValidAnswer(`out of which pool are you going to buy (1..${maxPoolNumber})?`, 
            ...getArrayOfNumberStringsUpTo(maxPoolNumber).filter(
                function(poolNumber){
                    return !usedPools.includes(parseInt(poolNumber));
                }
            )));
        const numberOfOptionsInPool = this.game.sanctuary[pool-1].dieFaces.length;

        let buy = parseInt(await questionUntilValidAnswer(`which dieface do you want? (1..${numberOfOptionsInPool})`, ...getArrayOfNumberStringsUpTo(numberOfOptionsInPool)));
        
        let bought = this.game.sanctuary[pool-1].dieFaces[buy - 1];
        console.log(`congrats you bought ${printDieFaceOption(bought)}`);

        let die = await this.chooseDieToReplaceDieFace(bought);
        await die.replaceFace(bought);

        this.gold -= this.game.sanctuary[pool - 1].cost;
        this.game.sanctuary[pool - 1].dieFaces.splice(buy - 1, 1);
        return pool;
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

    addGold(value: number): void {
        this.gold += value;
        if (this.gold > this.MAX_GOLD) {
            this.gold = this.MAX_GOLD;
        }
    }

    addSun(value: number): void {
        this.sun += value;
        if (this.sun > this.MAX_MOON_SUN) {
            this.sun = this.MAX_MOON_SUN;
        }
    }

    addMoon(value: number): void {
        this.moon += value;
        if (this.moon > this.MAX_MOON_SUN) {
            this.moon = this.MAX_MOON_SUN;
        }
    }

    addGloryPoints(value: number): void {
        this.gloryPoints += value;
    }

    getResourcesString() {
        return `${chalk.yellow(this.gold)}, ${chalk.blue(this.moon)}, ${chalk.red(this.sun)}, ${chalk.green(this.gloryPoints)}`;
    }

    extraChest(){
        this.MAX_GOLD += 4;
        this.MAX_MOON_SUN += 3;
    }
}