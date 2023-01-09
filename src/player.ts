import { shuffle } from './util';
import { DieFaceOption } from './diefaceoption';
import chalk from 'chalk';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import { Game } from './game';
import { HeroicFeatCard, HeroicFeatPortal } from './heroicfeatcard';
import { CostType } from './heroicfeatcardtype';

const terminal = readline.createInterface(input, output);
        
export class Player {

    private MAX_GOLD = 12;
    private MAX_MOON_SUN = 6;

    leftDie: Array<DieFaceOption>;
    rightDie: Array<DieFaceOption>;
    heroicFeats: Array<HeroicFeatCard>;
    currentPlatform: string;

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

        this.leftDie = new Array<DieFaceOption>(
            DieFaceOption.SUN_1,
            DieFaceOption.GOLD_1,
            DieFaceOption.GOLD_1,
            DieFaceOption.GOLD_1,
            DieFaceOption.GOLD_1,
            DieFaceOption.GOLD_1,
        );

        this.rightDie = new Array<DieFaceOption>(
            DieFaceOption.MOON_1,
            DieFaceOption.GP_2,
            DieFaceOption.GOLD_1,
            DieFaceOption.GOLD_1,
            DieFaceOption.GOLD_1,
            DieFaceOption.GOLD_1
        );

        this.heroicFeats = new Array();
    }

    toString = () => {
        return `${this.name}\t${this.leftDie}\t${this.rightDie}\n${chalk.yellow(this.gold)}\t${chalk.blue(this.moon)}\t${chalk.red(this.sun)}\t${chalk.green(this.gloryPoints)}\n${this.heroicFeats}`;
    }

    async divineBlessing(): Promise<void> {
        let rolls = new Array();
        rolls.push(this.rollDie(this.leftDie));
        rolls.push(this.rollDie(this.rightDie));
        await this.resolveDieRolls(rolls);
    }

    async minorBlessing(die: Array<DieFaceOption>): Promise<void> {
        this.resolveDieRolls(new Array(this.rollDie(die)));
    }

    async resolveDieRolls(rolls: Array<DieFaceOption>): Promise<void>{
        if(this.rollsWithChoice(rolls)){
            console.log(`you rolled ${rolls}\ncurrent resources:\n${this}`);
        }
        for(let roll of rolls){
            switch (roll) {
                case DieFaceOption.GOLD_1: this.addGold(1); break;
                case DieFaceOption.GOLD_2_MOON_1: this.addGold(2); this.addMoon(1); break;
                case DieFaceOption.GOLD_3: this.addGold(3); break;
                case DieFaceOption.GOLD_4: this.addGold(4); break;
                case DieFaceOption.GOLD_6: this.addGold(6); break;
                case DieFaceOption.GP_2: this.addGloryPoints(2); break;
                case DieFaceOption.GP_3: this.addGloryPoints(3); break;
                case DieFaceOption.GP_4: this.addGloryPoints(4); break;
                case DieFaceOption.MOON_1: this.addMoon(1); break;
                case DieFaceOption.MOON_2: this.addMoon(2); break;
                case DieFaceOption.MOON_GP_2: this.addMoon(2); this.addGloryPoints(2);
                case DieFaceOption.MOON_SUN_GOLD_GP_1: this.addMoon(1); this.addSun(1); this.addGold(1); this.addGloryPoints(1); break;
                case DieFaceOption.PICK_GOLD_3_GP_2: 
                let pickGoldGP = await this.questionUntilValidAnswer("you want the gold (G) or glory points(P)?", 'G', 'P'); 
                if(pickGoldGP.toUpperCase() === 'G'){
                    this.addGold(3);
                }else if(pickGoldGP.toUpperCase() === 'P'){
                    this.addGloryPoints(2);
                }
                break;
                case DieFaceOption.PICK_GOLD_MOON_SUN_1: 
                let pick1GoldMoonSun = await this.questionUntilValidAnswer("you want the gold (G), moon shards (M) or sun shards (S)", 'G', 'M', 'S');
                if(pick1GoldMoonSun.toUpperCase() === 'G'){
                    this.addGold(1);
                }else if(pick1GoldMoonSun.toUpperCase() === 'M'){
                    this.addMoon(1);
                }else if(pick1GoldMoonSun.toUpperCase() === 'S'){
                    this.addSun(1);
                }
                break;
                case DieFaceOption.PICK_GOLD_MOON_SUN_2: 
                let pick2GoldMoonSun = await this.questionUntilValidAnswer("you want the gold (G), moon shards (M) or sun shards (S)", 'G', 'M', 'S');
                if(pick2GoldMoonSun.toUpperCase() === 'G'){
                    this.addGold(2);
                }else if(pick2GoldMoonSun.toUpperCase() === 'M'){
                    this.addMoon(2);
                }else if(pick2GoldMoonSun.toUpperCase() === 'S'){
                    this.addSun(2);
                }
                break;
                case DieFaceOption.SUN_1: this.addSun(1); break;
                case DieFaceOption.SUN_1_GP_1: this.addSun(1); this.addGloryPoints(1); break;
                case DieFaceOption.SUN_2: this.addSun(2); break;
            }
        }
    }

    private rollsWithChoice(rolls: Array<DieFaceOption>): boolean{
        return rolls.includes(DieFaceOption.PICK_GOLD_3_GP_2) || 
                    rolls.includes(DieFaceOption.PICK_GOLD_MOON_SUN_1) ||
                    rolls.includes(DieFaceOption.PICK_GOLD_MOON_SUN_2);
    }

    takeTurn = async () => {
        try {
            let answer = await this.questionUntilValidAnswer("What do you want to do now? (F) Forge / (H) Heroic feat", 'F', 'H');
            if(answer.toUpperCase() === 'F'){
                //TODO: valideer geen dobbelsteenzijdes uit dezelfde bak tijdens 1 actie
                await this.forge();
            }else if(answer.toUpperCase() === 'H'){
                await this.heroicFeat();
            }
        } catch (err) {
            console.log(`WTF, something is wrong here\nerr: ${err}`);
        }
    }

    private async heroicFeat(): Promise<void>{
        for(let portal of this.game.heroicFeats.entries()){
            console.log(`${portal[0]}: ${portal[1]}`);
        }

        //TODO: verdringing
        console.log(`available platforms: ${this.availablePlatforms()}`);
        let platform = await this.questionUntilValidAnswer("To which platform do you want to jump?", ...this.availablePlatforms());

        //NOTE: needed for use in filter function
        let currentPlayer = this;

        let cards = this.game.heroicFeats.get(platform)?.filter(
            function(card: HeroicFeatCard){
                switch(card.costType){
                    case CostType.MOON: return currentPlayer.moon >= card.cost;
                    case CostType.SUN: return currentPlayer.sun >= card.cost;
                    case CostType.BOTH: return currentPlayer.moon >= card.cost && currentPlayer.sun >= card.cost;        
                }
            }
        );

        let chosenCardNumber = parseInt(await this.questionUntilValidAnswer(`Which card do you want to buy (1..${cards?.length})`, ...this.getArrayOfNumberStringsUpTo(cards?.length || 0)));
        let chosenCard = this.game.heroicFeats.get(platform)?.splice(chosenCardNumber - 1, 1)[0];
        if(chosenCard === undefined){
            return;
        }
        console.log(`${chosenCard}`);
        this.heroicFeats.push(chosenCard);
        //TODO: effecten implementeren
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

    private async forge(): Promise<void>{
        let userEnd = false;
        let minimumCost = this.lowestAvailableCost();

        while(userEnd !== true && (minimumCost !== -1 && this.gold >= minimumCost)){
            this.printSanctuary();
            await this.buyAndReplaceDieFace();
            minimumCost = this.lowestAvailableCost();

            let continueForging = await this.questionUntilValidAnswer("do you want to keep forging? (Y/N)", 'Y', 'N');
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
            console.log(`${dieFacePool}`);
        }
    }

    private async buyAndReplaceDieFace() {
        let pool = parseInt(await this.questionUntilValidAnswer(`out of which pool are you going to buy (1..${this.highestAffordablePool()})?`, ...this.getArrayOfNumberStringsUpTo(this.highestAffordablePool())));
        const numberOfOptionsInPool = this.game.sanctuary[pool-1].dieFaces.length;

        let buy = parseInt(await this.questionUntilValidAnswer(`which dieface do you want? (1..${numberOfOptionsInPool})`, ...this.getArrayOfNumberStringsUpTo(numberOfOptionsInPool)));
        
        let bought = this.game.sanctuary[pool-1].dieFaces[buy - 1];
        console.log(`congrats you bought ${bought}`);

        await this.replaceDieFace(bought);

        this.gold -= this.game.sanctuary[pool - 1].cost;
        this.game.sanctuary[pool - 1].dieFaces.splice(buy - 1, 1);
    }

    private getArrayOfNumberStringsUpTo(maxOptions: number): Array<string> {
        let options: string[] = new Array();
        for (let i = 1; i <= maxOptions; i++) {
            options.push(i + "");
        }
        return options;
    }

    private async replaceDieFace(bought: DieFaceOption) {
        let leftRight = await this.questionUntilValidAnswer("on which die you want to forge this lovely dieface? Left (L) or Right (R)", 'R', 'L');
        if (leftRight.toUpperCase() === 'R') {
            console.log(`you chose to forge it onto the following die\n${this.rightDie}`);
        } else if (leftRight.toUpperCase() === 'L') {
            console.log(`you chose to forge it onto the following die\n${this.leftDie}`);
        }

        let dieFaceToReplace = parseInt(await this.questionUntilValidAnswer("which dieface you want to replace it with? (1..6)", ...this.getArrayOfNumberStringsUpTo(6)));
        if (leftRight.toUpperCase() === 'R') {
            this.rightDie[dieFaceToReplace - 1] = bought;
            console.log(`new die: ${this.rightDie}`);
        } else if (leftRight.toUpperCase() === 'L') {
            this.leftDie[dieFaceToReplace - 1] = bought;
            console.log(`new die: ${this.leftDie}`);
        }
    }

    async questionUntilValidAnswer(message: string, ...options: string[]): Promise<string>{
        options.map(option => option.toUpperCase());
        let answer = await this.question(message);
        while(!options.includes((answer + "").toUpperCase())){
            console.log(`sorry, ${answer} is not valid`);
            answer = await this.question(message);
        }
        return answer + "";
    }

    private async question(message: string) {
        return new Promise(resolve => {terminal.question(message, resolve);});
    }

    private rollDie(die: Array<DieFaceOption>): DieFaceOption {
        shuffle(die);
        return die[0];
    }

    private addGold(value: number): void {
        this.gold += value;
        if (this.gold > this.MAX_GOLD) {
            this.gold = this.MAX_GOLD;
        }
    }

    private addSun(value: number): void {
        this.sun += value;
        if (this.sun > this.MAX_MOON_SUN) {
            this.sun = this.MAX_MOON_SUN;
        }
    }

    private addMoon(value: number): void {
        this.moon += value;
        if (this.moon > this.MAX_MOON_SUN) {
            this.moon = this.MAX_MOON_SUN;
        }
    }

    private addGloryPoints(value: number): void {
        this.gloryPoints += value;
    }
}