import { Sanctuary } from './dice/Sanctuary';
import { GameRound } from './GameRound';
import { HeroicFeatIsland } from './heroicfeats/HeroicFeatIsland';
import { Player } from './Player';
import { PlayerTurn } from './PlayerTurn';
import { getDieFacesAsPrettyString, RIGHT_PADDING_LENGTH, toPaddedString } from './util';

export class Game {

    sanctuary: Sanctuary;
    heroicFeats: HeroicFeatIsland;
    players: Array<Player>;

    currentRoundNumber:number = 0;
    currentPlayerTurn: PlayerTurn | null = null;

    GAME_ROUNDS: number = 9;

    constructor(playerCount: number) {
        this.sanctuary = new Sanctuary(playerCount);
        this.heroicFeats = new HeroicFeatIsland(playerCount);

        this.players = new Array();
        for (let i = 0; i < playerCount; i++) {
            this.players.push(new Player(3 - i, this, `player ${i + 1}`));
        }

        if (playerCount === 3) {
            this.GAME_ROUNDS = 10;
        }
    }

    async start(): Promise<void> {
        for (let i = 1; i <= this.GAME_ROUNDS; i++) {
            this.currentRoundNumber = i;
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

    toString(): string {
        return `${'Sanctuary'.padEnd(RIGHT_PADDING_LENGTH)}HeroicFeats
-------------------------------------------------------------------------------------------------------------------------------------------------------
${this.sanctuary.pools[0]}${this.heroicFeats.platforms[0]}
${this.sanctuary.pools[1]}${this.heroicFeats.platforms[1]}
${this.sanctuary.pools[2]}${this.heroicFeats.platforms[2]}
${this.sanctuary.pools[3]}${this.heroicFeats.platforms[3]}
${this.sanctuary.pools[4]}${this.heroicFeats.platforms[4]}
${this.sanctuary.pools[5]}${this.heroicFeats.platforms[5]}
${this.sanctuary.pools[6]}${this.heroicFeats.platforms[6]}
${this.sanctuary.pools[7]}
${this.sanctuary.pools[8]}
${this.sanctuary.pools[9]}

ROUND: ${this.currentRoundNumber}
-------------------------------------------------------------------------------------------------------------------------------------------------------
${this.getAllPlayersInformation()}`;
    }

    private getAllPlayersInformation() {
        let result = this.players.reduce((accumulator, player) => {
            let playerName = player.name;
            if(player === this.currentPlayerTurn?.player){
                playerName += " *";
            }
            accumulator += `${playerName.padEnd(RIGHT_PADDING_LENGTH)}|`
            return accumulator;
        }, '');
        result = this.emptyLineInPlayerInformation(result);
        result = this.players.reduce((accumulator, player) => accumulator += `${getDieFacesAsPrettyString('L', player.leftDie.faces, true)}|`, result + '\n');
        result = this.players.reduce((accumulator, player) => accumulator += `${getDieFacesAsPrettyString('R', player.rightDie.faces, true)}|`, result + '\n');
        result = this.emptyLineInPlayerInformation(result);
        result = this.players.reduce((accumulator, player) => accumulator += `${player.getResourcesString(true)}|`, result + '\n');
        result = this.emptyLineInPlayerInformation(result);
        result = this.players.reduce((accumulator) => accumulator += `${'Reinforcements:'.padEnd(RIGHT_PADDING_LENGTH)}|`, result + '\n');
     
        //TODO: count reinforcements by type
        result = this.players.reduce((accumulator, player) => accumulator += player.reinforcements.map(reinforcement => reinforcement.constructor.name).join(', ').padEnd(RIGHT_PADDING_LENGTH) + '|', result +'\n');

        return result + '\n';
    }

    private emptyLineInPlayerInformation(start: string): string {
        return this.players.reduce((accumulator) => {
            for (let i = 0; i < RIGHT_PADDING_LENGTH; i++) {
                accumulator += ' '
            }
            return accumulator + '|';
        }, start + '\n');

    }
}