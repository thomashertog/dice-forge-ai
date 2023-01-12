import { AllSanctuaryDieFaces, AllHeroicFeats } from './data';
import { DieFacePool } from './diefacepool';
import { HeroicFeatCard } from './heroicfeats/HeroicFeatCard';
import { Player } from './player';
import { shuffle } from './util';

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
        await player.takeTurn();
        if(player.sun >= 2){
            let extraTurn = await player.questionUntilValidAnswer(`${player}\nWould you like to perform an extra action for 2 sun shards? Yes (Y) / No (N)`, "Y", "N");
            if(extraTurn === "Y"){
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
}