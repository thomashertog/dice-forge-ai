import chalk from "chalk";
import { shuffle } from "lodash";
import { AllSanctuaryDieFaces } from "../data";
import { getDieFacesAsPrettyString } from "../util";
import { DieFacePool } from "./DieFacePool";
import { DieFace } from "./faces/DieFace";

export class Sanctuary {

    pools: Array<DieFacePool>;

    toString(): string {
        return this.pools.map(pool => `${chalk.yellow(pool.cost)}: ${pool.dieFaces}`).join('\n');
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

    availablePools(maxCost: number, boughtDieFaces: Array<DieFace>): Array<DieFacePool> {
        return this.pools
            .filter(pool => pool.dieFaces.length !== 0 && maxCost >= pool.cost)
            .filter(pool => !allFacesInPoolAreAlreadyBought(pool));

        function allFacesInPoolAreAlreadyBought(pool: DieFacePool): boolean {
            return pool.dieFaces.every(dieFace => boughtDieFaces.map(face => face.code).includes(dieFace.code));
        }
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