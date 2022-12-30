import { DieFaceOption } from './diefaceoption';
import chalk from 'chalk';

export class DieFacePool{

    dieFaces : DieFaceOption[];
    cost: number;

    constructor(cost: number, faces: DieFaceOption[]){
        this.cost = cost;
        this.dieFaces = faces;
    }

    addDieFace(face: DieFaceOption):void{
        this.dieFaces.push(face);
    }

    toString = () => {
        let result = `${chalk.yellow(this.cost)}:\t`;
        for(let dieFace of this.dieFaces){
            switch(dieFace){
                case DieFaceOption.GOLD_1: result+= ` ${chalk.yellow(1)}; `; break;
                case DieFaceOption.GOLD_3: result+= ` ${chalk.yellow(3)}; `; break;
                case DieFaceOption.GOLD_4: result += ` ${chalk.yellow(4)}; `; break;
                case DieFaceOption.GOLD_2_MOON_1: result += ` ${chalk.yellow(2)}+${chalk.blue(1)}; `; break;
                case DieFaceOption.GOLD_6: result += ` ${chalk.yellow(6)}; `; break;
                case DieFaceOption.GP_2: result += ` ${chalk.green(2)}; `; break;
                case DieFaceOption.GP_3: result += ` ${chalk.green(3)}; `; break;
                case DieFaceOption.GP_4: result += ` ${chalk.green(4)}; `; break;
                case DieFaceOption.MOON_1: result += ` ${chalk.blue(1)}; `; break;
                case DieFaceOption.MOON_2: result += ` ${chalk.blue(2)}; `; break;
                case DieFaceOption.SUN_1: result += ` ${chalk.red(1)}; `; break;
                case DieFaceOption.SUN_2: result += ` ${chalk.red(2)}; `; break;
                case DieFaceOption.MOON_GP_2: result += ` ${chalk.blue(2)}+${chalk.green(2)}; `; break;
                case DieFaceOption.MOON_SUN_GOLD_GP_1: result += ` ${chalk.yellow(1)}+${chalk.red(1)}+${chalk.blue(1)}+${chalk.green(1)}; `; break;
                case DieFaceOption.PICK_GOLD_3_GP_2: result += ` ${chalk.yellow(3)}/${chalk.green(2)}; `; break;
                case DieFaceOption.PICK_GOLD_MOON_SUN_1: result+= ` ${chalk.yellow(1)}/${chalk.red(1)}/${chalk.blue(1)}; `; break;
                case DieFaceOption.PICK_GOLD_MOON_SUN_2: result+= ` ${chalk.yellow(2)}/${chalk.red(2)}/${chalk.blue(2)}; `; break;
                case DieFaceOption.SUN_1_GP_1: result += ` ${chalk.red(1)}+${chalk.green(1)}; `; break;
            }
        }
        return result;
    }
}