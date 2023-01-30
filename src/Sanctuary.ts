import chalk from "chalk";
import { shuffle } from "lodash";
import { AllSanctuaryDieFaces } from "./data";
import { DieFacePool } from "./DieFacePool";
import { getDieFacesAsPrettyString } from "./util";

export class Sanctuary {

    pools: Array<DieFacePool>;

    toString(): string {
        let result = "";
        for (let pool of this.pools) {
            result += `${chalk.yellow(pool.cost)}: ${getDieFacesAsPrettyString("", pool.dieFaces)}\n`;
        }
        return result;
    }

    constructor(numberOfPlayers: number) {
        this.pools = new Array();
        for (let pool of AllSanctuaryDieFaces) {
            shuffle(pool.dieFaces);
            if (numberOfPlayers === 2) {
                pool.dieFaces = pool.dieFaces.slice(2);
            }
            this.pools.push(pool);
        }
    }

    availablePoolNumbers(maxCost: number): Array<number> {
        let result = new Array();

        this.pools.forEach(
            (pool, index) => { 
                if (pool.dieFaces.length !== 0 && maxCost >= pool.cost){
                    result.push(index+1);
                }
            });
        return result;
    }

    lowestAvailablePoolCost(maxCost: number): number {
        for (let pool of this.pools) {
            if (maxCost > pool.cost) {
                if (pool.dieFaces.length > 0) {
                    return pool.cost;
                }
            } else {
                break; 
            }
        }
        return -1;
    }


}