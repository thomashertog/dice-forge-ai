import { Sanctuary } from './dice/Sanctuary';
import { GameRound } from './GameRound';
import { HeroicFeatIsland } from './heroicfeats/HeroicFeatIsland';
import { Player } from './Player';

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

        if(playerCount === 3){
            this.GAME_ROUNDS = 10;
        }
    }

    async start(): Promise<void> {
        console.log(`game started with ${this.players.length} players`)
        for (let i = 1; i <= this.GAME_ROUNDS; i++) {
            await new GameRound(i, this).start(this.players);
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
}