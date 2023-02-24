import chalk from "chalk";
import { shuffle } from "lodash";
import { AllSanctuaryDieFaces } from "../data";
import { DieFacePool } from "./DieFacePool";
import { BuyableDieFace } from "./faces/BuyableDieFace";

export class Sanctuary {
    
    removeDieFace(face: BuyableDieFace) {
        this.pools.find(pool => pool.dieFaces.includes(face))?.removeDieFace(face);
    }

    pools: Array<DieFacePool>;

    toString(): string {
        return this.pools.map(pool => 
            `${chalk.yellow(pool.cost)}: ${pool.dieFaces.map(face => `${face.toString()} (${face.code})`).join(', ')}`)
            .join('\n');
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

    buyableDieFacesFor(maxCost: number, boughtDieFaces: Set<BuyableDieFace>): Array<BuyableDieFace> {
        return this.pools
            .filter(pool => pool.dieFaces.length !== 0 && maxCost >= pool.cost)
            .flatMap(pool => pool.dieFaces)
            .filter(dieFace => !Array.from(boughtDieFaces).map(face => face.code).includes(dieFace.code));
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