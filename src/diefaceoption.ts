import chalk from "chalk";

export enum DieFaceOption{
    GOLD_1 = "GOLD_1",
    GP_2 = "GP_2",
    GOLD_3 = "GOLD_3",
    MOON_1 = "MOON_1",
    GOLD_4 = "GOLD_4",
    SUN_1 = "SUN_1",
    GOLD_6 = "GOLD_6",
    GOLD_2_MOON_1 = "GOLD_2_MOON_1",
    PICK_GOLD_MOON_SUN_1 = "PICK_GOLD_MOON_SUN_1",
    SUN_1_GP_1 = "SUN_1_GP_1",
    PICK_GOLD_3_GP_2 = "PICK_GOLD_3_GP_2",
    MOON_2 = "MOON_2",
    SUN_2 = "SUN_2",
    GP_3 = "GP_3",
    PICK_GOLD_MOON_SUN_2 = "PICK_GOLD_MOON_SUN_2",
    GP_4 = "GP_4",
    MOON_SUN_GOLD_GP_1 = "MOON_SUN_GOLD_GP_1",
    MOON_GP_2 = "MOON_GP_2",
    HELMET = "HELMET",
    MIRROR = "MIRROR"
}

export function printDieFaceOption(option: DieFaceOption): string{
    switch(option){
        case DieFaceOption.GOLD_1: return chalk.yellow(1);
        case DieFaceOption.GP_2: return chalk.green(2);
        case DieFaceOption.GOLD_3: return chalk.yellow(3);
        case DieFaceOption.MOON_1: return chalk.blue(1);
        case DieFaceOption.GOLD_4: return chalk.yellow(4);
        case DieFaceOption.SUN_1: return chalk.red(1);
        case DieFaceOption.GOLD_6: return chalk.yellow(6);
        case DieFaceOption.GOLD_2_MOON_1: return `${chalk.yellow(2)}+${chalk.blue(1)}`;
        case DieFaceOption.PICK_GOLD_MOON_SUN_1: return `${chalk.yellow(1)}/${chalk.blue(1)}/${chalk.red(1)}`;
        case DieFaceOption.SUN_1_GP_1: return `${chalk.red(1)}+${chalk.green(1)}`;
        case DieFaceOption.PICK_GOLD_3_GP_2: return `${chalk.yellow(3)}/${chalk.green(2)}`;
        case DieFaceOption.MOON_2: return chalk.blue(2);
        case DieFaceOption.SUN_2: return chalk.red(2);
        case DieFaceOption.GP_3: return chalk.green(3);
        case DieFaceOption.PICK_GOLD_MOON_SUN_2: return `${chalk.yellow(2)}/${chalk.blue(2)}/${chalk.red(2)}`;
        case DieFaceOption.GP_4: return chalk.green(4);
        case DieFaceOption.MOON_SUN_GOLD_GP_1: return `${chalk.yellow(1)}+${chalk.blue(1)}+${chalk.red(1)}+${chalk.green(1)}`;
        case DieFaceOption.MOON_GP_2: return `${chalk.green(2)}+${chalk.blue(2)}`;
        case DieFaceOption.HELMET: return `${chalk.bgGray('x3')}`;
        case DieFaceOption.MIRROR: return `${chalk.bgCyan(' ')}`;
        default: return option;
    }
}