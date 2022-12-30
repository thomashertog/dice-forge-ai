import { shuffle } from './util';
import { DieFaceOption } from './diefaceoption';
import chalk from 'chalk';
import * as readline from 'readline';
import { rawListeners, stdin as input, stdout as output } from 'process';
import * as util from 'util';
import { Game } from './game';
import { DieFacePool } from './diefacepool';

const terminal = readline.createInterface(input, output);
        
export class Player {

    private MAX_GOLD = 12;
    private MAX_MOON_SUN = 6;

    leftDie: Array<DieFaceOption>;
    rightDie: Array<DieFaceOption>;

    gold: number;
    moon: number;
    sun: number;
    gloryPoints: number;

    game: Game;

    constructor(initialGold: number, game: Game) {
        this.game = game;
        this.gold = initialGold;
        this.sun = 0;
        this.moon = 0;
        this.gloryPoints = 0;

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
    }

    toString = () => {
        return chalk.yellow(this.gold) + "\t" + chalk.blue(this.moon) + "\t" + chalk.red(this.sun) + "\t" + chalk.green(this.gloryPoints);
    }

    divineBlessing(): void {
        this.minorBlessing(this.leftDie);
        this.minorBlessing(this.rightDie);
    }

    minorBlessing(die: Array<DieFaceOption>): void {
        let dieResult = this.rollDie(die);
        switch (dieResult) {
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
            case DieFaceOption.PICK_GOLD_3_GP_2: throw new Error("not yet implemented");
            case DieFaceOption.PICK_GOLD_MOON_SUN_1: throw new Error("not yet implemented");
            case DieFaceOption.PICK_GOLD_MOON_SUN_2: throw new Error("not yet implemented");
            case DieFaceOption.SUN_1: this.addSun(1); break;
            case DieFaceOption.SUN_1_GP_1: this.addSun(1); this.addGloryPoints(1); break;
            case DieFaceOption.SUN_2: this.addSun(2); break;
        }
    }

    takeTurn = async () => {
        try {
            let answer = await this.question("What do you want to do now? (F) Forge / (H) Heroic feat");
            while(answer !== 'F' && answer !== 'H'){
                console.log(`${answer} is not a valid option`);
                answer = await this.question("What do you want to do now? (F) Forge / (H) Heroic feat");
            }
            if(answer === 'F'){
                await this.forge();
            }else{
                console.log(`allright, pick any heroic feat available, you have ${this.moon} moon shards and ${this.sun} sun shards available`);
            }
        } catch (err) {
            console.log("WTF, something is wrong here");
        }
    }

    private async forge(): Promise<void>{
        let userEnd = false;
        let minimumCost = this.lowestAvailableCost();

        while(userEnd !== true || (minimumCost !== -1 && this.gold > minimumCost)){
            this.printForge();
            await this.buyDieFace();
            minimumCost = this.lowestAvailableCost();

            let continueForging = await this.question("do you want to keep forging? (Y/N)");
            if (continueForging === 'N') {
                userEnd = true;
            }
        }

    }

    private lowestAvailableCost(): number{
        for(let pool of this.game.forge){
            if(pool.dieFaces.length > 0){
                return pool.cost;
            }
        }
        return -1;
    }

    private printForge() {
        console.log(`so you want to forge, right, go ahead, you have ${this.gold} gold to spend`);
        for (let dieFacePool of this.game.forge) {
            console.log(`${dieFacePool}`);
        }
    }

    private async buyDieFace() {
        let pool = await this.question("out of which pool are you going to buy (1..10)?");
        let poolNumber = parseInt(pool + "");
        let buy = await this.question(`which dieface do you want? (1..${this.game.forge[poolNumber - 1].dieFaces.length})`);
        let buyNumber = parseInt(buy + "");
        console.log(`congrats you bought ${this.game.forge[poolNumber - 1].dieFaces[buyNumber - 1]}`);
        this.gold -= this.game.forge[poolNumber - 1].cost;
        this.game.forge[poolNumber - 1].dieFaces = this.game.forge[poolNumber - 1].dieFaces.slice(buyNumber - 1, 1);
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