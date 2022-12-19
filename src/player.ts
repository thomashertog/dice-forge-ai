import { shuffle } from './util';
import { DieFaceOption } from './diefaceoption';
import chalk from 'chalk';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import * as util from 'util';

export class Player{

    private MAX_GOLD = 12;
    private MAX_MOON_SUN = 6;
    
    leftDie: Array<DieFaceOption>;
    rightDie: Array<DieFaceOption>;

    gold: number;
    moon: number;
    sun: number;
    gloryPoints: number;

    constructor(initialGold : number){
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

    divineBlessing():void{
        this.minorBlessing(this.leftDie);
        this.minorBlessing(this.rightDie);
    }

    minorBlessing(die: Array<DieFaceOption>):void{
        let dieResult = this.rollDie(die);
        switch(dieResult){
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
            case DieFaceOption.SUN_1_GP_1: this.addSun(1); break; this.addGloryPoints(1);
            case DieFaceOption.SUN_2: this.addSun(2); break;
        }
    }

    async takeTurn(): Promise<void>{
        const rl = readline.createInterface(input, output);
        const question = util.promisify(rl.question).bind(rl);
        let answer = await question("What do you want to do now? (F) Forge / (H) Heroic feat");
        console.log(`${answer} is an excellent choice, but it's not yet implemented`);
    }

    private rollDie(die : Array<DieFaceOption>) : DieFaceOption{
        shuffle(die);
        return die[0];
    }   

    private addGold(value: number):void{
        this.gold += value;
        if(this.gold > this.MAX_GOLD){
            this.gold = this.MAX_GOLD;
        }
    }

    private addSun(value: number):void{
        this.sun += value;
        if(this.sun > this.MAX_MOON_SUN){
            this.sun = this.MAX_MOON_SUN;
        }
    }

    private addMoon(value: number):void{
        this.moon += value;
        if(this.moon > this.MAX_MOON_SUN){
            this.moon = this.MAX_MOON_SUN;
        }
    }

    private addGloryPoints(value: number):void{
        this.gloryPoints += value;
    }
}