import chalk from "chalk";
import { shuffle } from "lodash";
import { AllSanctuaryDieFaces } from "../data";
import { getDieFacesAsPrettyString } from "../util";
import { DieFacePool } from "./DieFacePool";

export class Sanctuary {

    pools: Array<DieFacePool>;

    toString(): string {
        let result = "";
        let index = 1;
        for (let pool of this.pools) {
            result += `(${index}) -> ${chalk.yellow(pool.cost)}: ${pool.dieFaces}\n`;
            index++;
        }
        return result;
    }

    constructor(numberOfPlayers: number) {
        this.pools = new Array();
        for (let pool of AllSanctuaryDieFaces) {
            pool.dieFaces = shuffle(pool.dieFaces);
            if (numberOfPlayers === 2) {
                pool.dieFaces = pool.dieFaces.slice(2);
            }
            this.pools.push(pool);
        }
    }

    availablePoolIndices(maxCost: number): Array<number> {
        let result = new Array();

        this.pools.forEach(
            (pool, index) => {
                if (pool.dieFaces.length !== 0 && maxCost >= pool.cost) {
                    result.push(index);
                }
            });
        return result;
    }

    lowestAvailablePoolCost(maxCost: number): number {
        for (let pool of this.pools) {
            if (maxCost >= pool.cost) {
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