import { AllHeroicFeats, AllSanctuaryDieFaces } from './data';
import { DieFaceOption, printDieFaceOption } from './dice/DieFaceOption';
import { DieFacePool } from './dice/DieFacePool';
import { HeroicFeatCard } from './heroicfeats/HeroicFeatCard';
import { Player } from './Player';
import { ResolveMode } from './ResolveMode';
import { Sanctuary } from './dice/Sanctuary';
import { getArrayOfNumberStringsUpTo, questionUntilValidAnswer, shuffle } from './util';

export class Game {

    sanctuary: Sanctuary;
    players: Array<Player>;
    heroicFeats: Map<String, Array<HeroicFeatCard>>;

    GAME_ROUNDS: number = 9;

    constructor(playerCount: number) {
        this.sanctuary = new Sanctuary(playerCount);
        this.players = new Array();
        for (let i = 0; i < playerCount; i++) {
            this.players.push(new Player(3 - i, this, `player ${i + 1}`));
        }
        this.heroicFeats = new Map();
    }

    async start(): Promise<void> {
        console.log(`game started with ${this.players.length} players`)
        if (this.players.length === 3) {
            console.log("warning, this game has an extra round");
            this.GAME_ROUNDS = 10;
        }
        this.initializeHeroicFeats(this.players.length);
        for (let round = 1; round <= this.GAME_ROUNDS; round++) {
            await this.playRound(round);
        }

        let playersWithScores = new Map<string, number>;

        for (let player of this.players) {
            for (let heroicFeat of player.heroicFeats) {
                player.addGloryPoints(heroicFeat.getGloryPointsAtEndOfGame());
            }
            playersWithScores.set(player.name, player.gloryPoints);
        }

        console.log(playersWithScores);
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
        if (player.sun >= 2) {
            let extraTurn = 
                (await questionUntilValidAnswer(`
                    ${player}
                    Would you like to perform an extra action for 2 sun shards? Yes (Y) / No (N)`, 
                    "Y", "N")).toUpperCase();
            if (extraTurn === "Y") {
                player.addSun(-2);
                await player.takeTurn();
            }
        }
    }

    private async startTurn(): Promise<void> {
        await this.everybodyReceivesDivineBlessing();

        if (this.players.length === 2) {
            await this.everybodyReceivesDivineBlessing();
        }
    }

    private async everybodyReceivesDivineBlessing(): Promise<Map<Player, DieFaceOption[]>> {
        let rollsForPlayers = this.everybodyRolls();

        for (let player of rollsForPlayers.keys()) {
            let rolls = rollsForPlayers.get(player);
            if (rolls !== undefined) {
                await this.handleMirrorRolls(rolls, player);
            }
        }

        for (let rollsForPlayer of rollsForPlayers.entries()) {
            await this.resolveDieRolls(rollsForPlayer[0], rollsForPlayer[1], ResolveMode.ADD);
        }
        return rollsForPlayers;
    }

    async handleMirrorRolls(rolls: Array<DieFaceOption>, player: Player): Promise<DieFaceOption[]> {
        if (rolls?.includes(DieFaceOption.MIRROR)) {
            let allRolls = new Array<DieFaceOption>;
            for (let player of this.players) {
                allRolls.push(player.leftDie.faces[0], player.rightDie.faces[0]);
            }

            let options = allRolls?.filter(roll => roll !== DieFaceOption.MIRROR);
            let replacementRoll = options[
                parseInt(
                    await questionUntilValidAnswer(`
                    you rolled ${printDieFaceOption(DieFaceOption.MIRROR)}
                    current resources: ${player.getResourcesString()}
                    options are: ${options.map(option => printDieFaceOption(option))}
                    which one do you pick? (1..${options.length})`, 
                    ...getArrayOfNumberStringsUpTo(options.length)))];


            return rolls.splice(rolls.indexOf(DieFaceOption.MIRROR), 1, replacementRoll);
        }

        return rolls;
    }

    private everybodyRolls(): Map<Player, DieFaceOption[]> {
        let rollsForPlayers = new Map<Player, DieFaceOption[]>;

        for (let player of this.players) {
            let rolls = player.divineBlessing();
            rollsForPlayers.set(player, rolls);
        }

        return rollsForPlayers;
    }

    private initializeHeroicFeats(numberOfPlayers: number): void {
        for (let portal of AllHeroicFeats) {
            let cards = new Array<HeroicFeatCard>();
            for (let card of portal.cards) {
                for (let i = 1; i <= numberOfPlayers; i++) {
                    cards.push(card);
                }
            }
            this.heroicFeats.set(portal.code, cards);
        }
    }

    async resolveDieRolls(player: Player, rolls: Array<DieFaceOption>, mode: ResolveMode): Promise<void> {
        if (this.rollsWithChoice(rolls)) {
            console.log(`
            you rolled ${rolls.map(roll => printDieFaceOption(roll))}
            current resources:
            ${player.getResourcesString()}`);
            await this.handleMirrorRolls(rolls, player);
        }

        let multiplier = 1;
        let helmetActive = false;

        for (let roll of rolls) {
            if (roll === 'HELMET' && rolls.length === 2) {
                helmetActive = true;
            }
        }

        if (helmetActive) {
            rolls.splice(rolls.indexOf(DieFaceOption.HELMET), 1);
            multiplier = 3;
        }

        if (mode === ResolveMode.SUBTRACT) {
            multiplier *= -1;
        }

        for (let roll of rolls) {
            await this.resolveDieRoll(player, roll, multiplier);
        }

        if (this.rollsWithChoice(rolls)) {
            console.log(`current resources: ${player.getResourcesString()}`);
        }
    }

    private async resolveDieRoll(currentPlayer: Player, roll: DieFaceOption, multiplier: number): Promise<void> {
        switch (roll) {
            case DieFaceOption.GOLD_1:
                await currentPlayer.addGold(multiplier * 1); break;
            case DieFaceOption.GOLD_2_MOON_1: await currentPlayer.addGold(multiplier * 2); currentPlayer.addMoon(multiplier * 1); break;
            case DieFaceOption.GOLD_3: await currentPlayer.addGold(multiplier * 3); break;
            case DieFaceOption.GOLD_4: await currentPlayer.addGold(multiplier * 4); break;
            case DieFaceOption.GOLD_6: await currentPlayer.addGold(multiplier * 6); break;
            case DieFaceOption.GP_2: currentPlayer.addGloryPoints(multiplier * 2); break;
            case DieFaceOption.GP_3: currentPlayer.addGloryPoints(multiplier * 3); break;
            case DieFaceOption.GP_4: currentPlayer.addGloryPoints(multiplier * 4); break;
            case DieFaceOption.MOON_1: currentPlayer.addMoon(multiplier * 1); break;
            case DieFaceOption.MOON_2: currentPlayer.addMoon(multiplier * 2); break;
            case DieFaceOption.MOON_GP_2: currentPlayer.addMoon(multiplier * 2); currentPlayer.addGloryPoints(multiplier * 2); break;
            case DieFaceOption.MOON_SUN_GOLD_GP_1: currentPlayer.addMoon(multiplier * 1); currentPlayer.addSun(multiplier * 1); await currentPlayer.addGold(multiplier * 1); currentPlayer.addGloryPoints(multiplier * 1); break;
            case DieFaceOption.PICK_GOLD_3_GP_2:
                let pickGoldGP = (await questionUntilValidAnswer(`
                current resources: ${currentPlayer.getResourcesString()}
                you want the gold (G) or glory points(P)?`, 
                'G', 'P')).toUpperCase();
                
                if (pickGoldGP === 'G') {
                    await currentPlayer.addGold(multiplier * 3);
                } else if (pickGoldGP === 'P') {
                    currentPlayer.addGloryPoints(multiplier * 2);
                }
                break;
            case DieFaceOption.PICK_GOLD_MOON_SUN_1:
                let pick1GoldMoonSun = (await questionUntilValidAnswer(`
                current resources: ${currentPlayer.getResourcesString()}
                you want the gold (G), moon shards (M) or sun shards (S)`, 
                'G', 'M', 'S')).toUpperCase();
                
                if (pick1GoldMoonSun === 'G') {
                    await currentPlayer.addGold(multiplier * 1);
                } else if (pick1GoldMoonSun === 'M') {
                    currentPlayer.addMoon(multiplier * 1);
                } else if (pick1GoldMoonSun === 'S') {
                    currentPlayer.addSun(multiplier * 1);
                }
                break;
            case DieFaceOption.PICK_GOLD_MOON_SUN_2:
                let pick2GoldMoonSun = (await questionUntilValidAnswer(`
                current resources: ${currentPlayer.getResourcesString()}
                you want the gold (G), moon shards (M) or sun shards (S)`,
                'G', 'M', 'S')).toUpperCase();
                
                if (pick2GoldMoonSun === 'G') {
                    await currentPlayer.addGold(multiplier * 2);
                } else if (pick2GoldMoonSun === 'M') {
                    currentPlayer.addMoon(multiplier * 2);
                } else if (pick2GoldMoonSun === 'S') {
                    currentPlayer.addSun(multiplier * 2);
                }
                break;
            case DieFaceOption.SUN_1: currentPlayer.addSun(multiplier * 1); break;
            case DieFaceOption.SUN_1_GP_1: currentPlayer.addSun(multiplier * 1); currentPlayer.addGloryPoints(multiplier * 1); break;
            case DieFaceOption.SUN_2: currentPlayer.addSun(multiplier * 2); break;
        }
    }

    private rollsWithChoice(rolls: Array<DieFaceOption>): boolean {
        return rolls.includes(DieFaceOption.PICK_GOLD_3_GP_2) ||
            rolls.includes(DieFaceOption.PICK_GOLD_MOON_SUN_1) ||
            rolls.includes(DieFaceOption.PICK_GOLD_MOON_SUN_2) ||
            rolls.includes(DieFaceOption.MIRROR);
    }

}