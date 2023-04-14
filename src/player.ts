import chalk from 'chalk';
import { Die } from './dice/Die';
import { GloryPoints2 } from './dice/faces/GloryPoints2';
import { Gold1 } from './dice/faces/Gold1';
import { Moon1 } from './dice/faces/Moon1';
import { Sun1 } from './dice/faces/Sun1';
import { HeroicFeatCard } from './heroicfeats/HeroicFeatCard';
import { ReinforcementEffect } from './heroicfeats/ReinforcementEffect';
import { RIGHT_PADDING_LENGTH, getDieFacesAsPrettyString } from './util';

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

    constructor(initialGold: number, name: string) {
        this.name = name;
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
${getDieFacesAsPrettyString("left", this.leftDie.faces)}    ${getDieFacesAsPrettyString("right", this.rightDie.faces)}
${this.getResourcesString()}
Reinforcements: ${this.reinforcements}
`;
    }

    addGoldToHammer(value: number){
        if(this.activeHammerCount > 0 && value > 0){
            let goldForHammerBeforeAdding = this.goldForHammer;
            this.goldForHammer += value;
            
            if(goldForHammerBeforeAdding < 15 && this.goldForHammer >= 15){
                this.addGloryPoints(10);
            }else if(goldForHammerBeforeAdding < 30 && this.goldForHammer >= 30){
                this.goldForHammer -= 30;
                this.activeHammerCount--;
                this.addGloryPoints(15);
            }
        }
    }

    addGold(value: number): void {
        this.gold += value;
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
}