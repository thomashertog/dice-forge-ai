import { Player } from "./Player";

export class GameRound{

    count: number;

    constructor(count: number){
        this.count = count;
    }

    async start(players: Array<Player>): Promise<void> {
        for await (let player of players) {
            await player.playTurn(player, this.count);
        }
    }

}