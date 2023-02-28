import { Game } from "./Game";
import { Player } from "./Player";
import { PlayerTurn } from "./PlayerTurn";

export class GameRound{

    count: number;
    game: Game;

    constructor(count: number, game: Game){
        this.count = count;
        this.game = game;
    }

    async start(players: Array<Player>): Promise<void> {
        for await (let player of players) {
            let turn = new PlayerTurn(player, this);
            await turn.play();
        }
    }

}