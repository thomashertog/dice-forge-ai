import { format } from 'path';
import { AllForgeDieFaces } from './data';
import { DieFacePool } from './diefacepool';
import { Player } from './player';
import { shuffle } from './util';

export class Game {

    forge: Array<DieFacePool>;
    players: Array<Player>;

    GAME_ROUNDS: number = 9;

    constructor() {
        this.forge = new Array();
        this.players = new Array();
    }

    start = async (playerCount: string) => {
        const numberOfPlayers = parseInt(playerCount);
        if (numberOfPlayers === 3) {
            this.GAME_ROUNDS = 10;
        }
        this.initializeForge();
        for (let i = 0; i < numberOfPlayers; i++) {
            this.players.push(new Player(3 - i));
        }

        for (let round = 1; round <= this.GAME_ROUNDS; round++) {
            await this.playRound(round);
        }
    }

    private async playRound(round: number): Promise<void> {
        for (let player of this.players) {
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

    private initializeForge() {
        this.forge = new Array<DieFacePool>;
        for (let pool of AllForgeDieFaces) {
            shuffle(pool.dieFaces);
            if (this.players.length === 2) {
                pool.dieFaces.length = 2;
            }
            this.forge.push(pool);
        }
    }
}