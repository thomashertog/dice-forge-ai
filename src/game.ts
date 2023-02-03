import { DieFace } from './dice/faces/DieFace';
import { Sanctuary } from './dice/Sanctuary';
import { HeroicFeatIsland } from './heroicfeats/HeroicFeatIsland';
import { Player } from './Player';
import { ResolveMode } from './ResolveMode';
import { questionUntilValidAnswer } from './util';

export class Game {

    sanctuary: Sanctuary;
    heroicFeats: HeroicFeatIsland;
    players: Array<Player>;

    GAME_ROUNDS: number = 9;

    constructor(playerCount: number) {
        this.sanctuary = new Sanctuary(playerCount);
        this.heroicFeats = new HeroicFeatIsland(playerCount);
        
        this.players = new Array();
        for (let i = 0; i < playerCount; i++) {
            this.players.push(new Player(3 - i, this, `player ${i + 1}`));
        }
    }

    async start(): Promise<void> {
        console.log(`game started with ${this.players.length} players`)
        if (this.players.length === 3) {
            console.log("warning, this game has an extra round");
            this.GAME_ROUNDS = 10;
        }
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

        for (let player of this.players) {
            await player.resolveDieRolls(rollsForPlayers.get(player) as Array<DieFace>, ResolveMode.ADD);
        }
        return rollsForPlayers;
    }

    private everybodyRolls(): Map<Player, DieFace[]> {
        let rollsForPlayers = new Map<Player, DieFace[]>;

        for (let player of this.players) {
            let rolls = player.divineBlessing();
            rollsForPlayers.set(player, rolls);
        }

        return rollsForPlayers;
    }
}