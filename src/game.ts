import { AllHeroicFeats } from './data';
import { DieFace } from './dice/faces/DieFace';
import { Helmet } from './dice/faces/Helmet';
import { Sanctuary } from './dice/Sanctuary';
import { HeroicFeatCard } from './heroicfeats/HeroicFeatCard';
import { Player } from './Player';
import { ResolveMode } from './ResolveMode';
import { questionUntilValidAnswer } from './util';

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
        let executed = await player.takeTurn();
        if (player.sun >= 2 && executed === true) {
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

    private async everybodyReceivesDivineBlessing(): Promise<Map<Player, DieFace[]>> {
        let rollsForPlayers = this.everybodyRolls();

        for (let rollsForPlayer of rollsForPlayers.entries()) {
            await this.resolveDieRolls(rollsForPlayer[0], rollsForPlayer[1], ResolveMode.ADD);
        }
        return rollsForPlayers;
    }

    async handleMirrorRolls(rolls: Array<DieFace>, currentPlayer: Player): Promise<DieFace[]> {
        if (rolls?.some(roll => DieFace.isMirror(roll))) {
            let allRolls = new Array<DieFace>;
            for (let player of this.players) {
                if (player !== currentPlayer) {
                    allRolls.push(player.leftDie.faces[0], player.rightDie.faces[0]);
                }
            }

            let options = allRolls?.filter(roll => !DieFace.isMirror(roll));
            let replacementRollChoice = await questionUntilValidAnswer(`
                    current resources: ${currentPlayer.getResourcesString()}
                    options are: ${options.map(option => option.printWithCode())}
                    which one do you pick?`,
                        ...options.map(option => option.code));


            let replacementRoll = allRolls.find(option => option.code === replacementRollChoice.toUpperCase()) as DieFace;
            return rolls.splice(rolls.findIndex(roll => roll.code === 'M'), 1, replacementRoll);
        }

        return rolls;
    }

    private everybodyRolls(): Map<Player, DieFace[]> {
        let rollsForPlayers = new Map<Player, DieFace[]>;

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

    async resolveDieRolls(player: Player, rolls: Array<DieFace>, mode: ResolveMode): Promise<void> {
        if (rolls.find(roll => DieFace.isMirror(roll)) !== undefined) {
            console.log(`
            you rolled ${rolls.map(roll => roll.toString())}
            current resources:
            ${player.getResourcesString()}`);
            await this.handleMirrorRolls(rolls, player);
        }

        let multiplier = 1;
        let helmetActive = false;

        for (let roll of rolls) {
            if (DieFace.isHelmet(roll) && rolls.length === 2) {
                helmetActive = true;
            }
        }

        if (helmetActive) {
            while (rolls.some(roll => DieFace.isHelmet(roll))) {
                rolls.splice(rolls.indexOf(new Helmet()), 1);
            }
            multiplier = 3;
        }

        if (mode === ResolveMode.SUBTRACT) {
            multiplier *= -1;
        }

        console.log(`resolving rolls for ${player.name} => ${rolls.map(roll => roll.toString())}\ncurrent resources: ${player.getResourcesString()}`);

        await rolls.filter(roll => !roll.hasChoice()).reduce((chain, roll) => chain.then(() => roll.resolveRoll(player, multiplier)), Promise.resolve());
        await rolls.filter(roll => roll.hasChoice()).reduce((chain, roll) => chain.then(() => roll.resolveRoll(player, multiplier)), Promise.resolve());

        console.log(`resolved rolls for ${player.name}\ncurrent resources: ${player.getResourcesString()}\n\n`);
    }
}