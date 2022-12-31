import { AllSanctuaryDieFaces as AllSanctuaryDieFaces } from './data';
import { DieFacePool } from './diefacepool';
import { Player } from './player';
import { shuffle } from './util';

export class Game {

    sanctuary: Array<DieFacePool>;
    players: Array<Player>;

    GAME_ROUNDS: number = 9;

    constructor() {
        this.sanctuary = new Array();
        this.players = new Array();
    }

    start = async (playerCount: string) => {
        console.log(`game started with ${playerCount} players`)
        const numberOfPlayers = parseInt(playerCount);
        if (numberOfPlayers === 3) {
            console.log("warning, this game has an extra round");
            this.GAME_ROUNDS = 10;
        }
        this.initializeSanctuary(numberOfPlayers);
        for (let i = 0; i < numberOfPlayers; i++) {
            this.players.push(new Player(3 - i, this));
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
        this.startTurn();
        console.log(`starting turn for player in round ${round}`);
        console.log("" + player);
        await player.takeTurn();
    }

    private startTurn = () => {
        for (let player of this.players) {
            player.divineBlessing();
            if (this.players.length === 2) {
                player.divineBlessing();
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
}