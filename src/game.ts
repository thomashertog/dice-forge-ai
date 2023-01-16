import { AllHeroicFeats, AllSanctuaryDieFaces } from './data';
import { DieFaceOption, printDieFaceOption } from './diefaceoption';
import { DieFacePool } from './diefacepool';
import { HeroicFeatCard } from './heroicfeats/HeroicFeatCard';
import { Player } from './player';
import { questionUntilValidAnswer, shuffle } from './util';

export class Game {

    sanctuary: Array<DieFacePool>;
    players: Array<Player>;
    heroicFeats: Map<String, Array<HeroicFeatCard>>;

    GAME_ROUNDS: number = 9;

    constructor() {
        this.sanctuary = new Array();
        this.players = new Array();
        this.heroicFeats = new Map();
    }

    start = async (playerCount: string) => {
        console.log(`game started with ${playerCount} players`)
        const numberOfPlayers = parseInt(playerCount);
        if (numberOfPlayers === 3) {
            console.log("warning, this game has an extra round");
            this.GAME_ROUNDS = 10;
        }
        this.initializeSanctuary(numberOfPlayers);
        this.initializeHeroicFeats(numberOfPlayers);
        for (let i = 0; i < numberOfPlayers; i++) {
            this.players.push(new Player(3 - i, this, `player ${i+1}`));
        }

        for (let round = 1; round <= this.GAME_ROUNDS; round++) {
            await this.playRound(round);
        }
    }

    private async playRound(round: number): Promise<void> {
        for await (let player of this.players) {
            await this.playTurn(player, round);
        }
    }

    private async playTurn(player: Player, round: number): Promise<void> {
        await this.startTurn();
        console.log(`starting turn for player in round ${round}`);
        await player.doReinforcements();
        await player.takeTurn();
        if(player.sun >= 2){
            let extraTurn = await (await questionUntilValidAnswer(`${player}\nWould you like to perform an extra action for 2 sun shards? Yes (Y) / No (N)`, "Y", "N")).toUpperCase();
            if(extraTurn === "Y"){
                player.addSun(-2);
                await player.takeTurn();
            }
        }
    }

    private startTurn = async () => {
        for (let player of this.players) {
            await player.divineBlessing();
            if (this.players.length === 2) {
                await player.divineBlessing();
            }
        }
    }

    private initializeSanctuary(numberOfPlayers: number) {
        this.sanctuary = new Array<DieFacePool>;
        for (let pool of AllSanctuaryDieFaces) {
            shuffle(pool.dieFaces);
            if (numberOfPlayers === 2) {
                pool.dieFaces = pool.dieFaces.slice(2);
            }
            this.sanctuary.push(pool);
        }
    }

    private initializeHeroicFeats(numberOfPlayers: number){
        for(let portal of AllHeroicFeats){
            let cards = new Array<HeroicFeatCard>();
            for(let card of portal.cards){
                for(let i = 1; i<=numberOfPlayers; i++){
                    cards.push(card);
                }
            }
            this.heroicFeats.set(portal.code, cards);
        }
    }

    static async resolveDieRolls(player: Player, rolls: Array<DieFaceOption>): Promise<void> {
        if (this.rollsWithChoice(rolls)) {
            console.log(`you rolled ${rolls.map(roll => printDieFaceOption(roll))}\ncurrent resources:\n${player.getResourcesString()}`);
        }

        let helmetActive = false;

        for (let roll of rolls) {
            if (roll === 'HELMET' && rolls.length === 2) {
                helmetActive = true;
            }
        }

        if (helmetActive) {
            rolls.splice(rolls.indexOf(DieFaceOption.HELMET), 1);
        }

        for (let roll of rolls) {
            await this.resolveDieRoll(player, roll, helmetActive);
        }
    }

    private static async resolveDieRoll(player: Player, roll: DieFaceOption, helmetActive: boolean) {
        switch (roll) {
            case DieFaceOption.GOLD_1: player.addGold(helmetActive ? 3 : 1); break;
            case DieFaceOption.GOLD_2_MOON_1: player.addGold(2); player.addMoon(helmetActive ? 3 : 1); break;
            case DieFaceOption.GOLD_3: player.addGold(helmetActive ? 9 : 3); break;
            case DieFaceOption.GOLD_4: player.addGold(helmetActive ? 12 : 4); break;
            case DieFaceOption.GOLD_6: player.addGold(helmetActive ? 18 : 6); break;
            case DieFaceOption.GP_2: player.addGloryPoints(helmetActive ? 6 : 2); break;
            case DieFaceOption.GP_3: player.addGloryPoints(helmetActive ? 9 : 3); break;
            case DieFaceOption.GP_4: player.addGloryPoints(helmetActive ? 12 : 4); break;
            case DieFaceOption.MOON_1: player.addMoon(helmetActive ? 3 : 1); break;
            case DieFaceOption.MOON_2: player.addMoon(helmetActive ? 6 : 2); break;
            case DieFaceOption.MOON_GP_2: player.addMoon(helmetActive ? 6 : 2); player.addGloryPoints(helmetActive ? 6 : 2); break;
            case DieFaceOption.MOON_SUN_GOLD_GP_1: player.addMoon(helmetActive ? 3 : 1); player.addSun(helmetActive ? 3 : 1); player.addGold(helmetActive ? 3 : 1); player.addGloryPoints(helmetActive ? 3 : 1); break;
            case DieFaceOption.PICK_GOLD_3_GP_2:
                let pickGoldGP = await (await questionUntilValidAnswer(`current resources: ${player.getResourcesString()} you want the gold (G) or glory points(P)?`, 'G', 'P')).toUpperCase();
                if (pickGoldGP === 'G') {
                    player.addGold(helmetActive ? 9 : 3);
                } else if (pickGoldGP === 'P') {
                    player.addGloryPoints(helmetActive ? 6 : 2);
                }
                break;
            case DieFaceOption.PICK_GOLD_MOON_SUN_1:
                let pick1GoldMoonSun = await (await questionUntilValidAnswer("you want the gold (G), moon shards (M) or sun shards (S)", 'G', 'M', 'S')).toUpperCase();
                if (pick1GoldMoonSun === 'G') {
                    player.addGold(helmetActive ? 3 : 1);
                } else if (pick1GoldMoonSun === 'M') {
                    player.addMoon(helmetActive ? 3 : 1);
                } else if (pick1GoldMoonSun === 'S') {
                    player.addSun(helmetActive ? 3 : 1);
                }
                break;
            case DieFaceOption.PICK_GOLD_MOON_SUN_2:
                let pick2GoldMoonSun = await (await questionUntilValidAnswer("you want the gold (G), moon shards (M) or sun shards (S)", 'G', 'M', 'S')).toUpperCase();
                if (pick2GoldMoonSun === 'G') {
                    player.addGold(helmetActive ? 6 : 2);
                } else if (pick2GoldMoonSun === 'M') {
                    player.addMoon(helmetActive ? 6 : 2);
                } else if (pick2GoldMoonSun === 'S') {
                    player.addSun(helmetActive ? 6 : 2);
                }
                break;
            case DieFaceOption.SUN_1: player.addSun(helmetActive ? 3 : 1); break;
            case DieFaceOption.SUN_1_GP_1: player.addSun(helmetActive ? 3 : 1); player.addGloryPoints(helmetActive ? 3 : 1); break;
            case DieFaceOption.SUN_2: player.addSun(helmetActive ? 6 : 2); break;
        }
    }

    private static rollsWithChoice(rolls: Array<DieFaceOption>): boolean {
        return rolls.includes(DieFaceOption.PICK_GOLD_3_GP_2) ||
            rolls.includes(DieFaceOption.PICK_GOLD_MOON_SUN_1) ||
            rolls.includes(DieFaceOption.PICK_GOLD_MOON_SUN_2) ||
            rolls.includes(DieFaceOption.MIRROR);
    }

}