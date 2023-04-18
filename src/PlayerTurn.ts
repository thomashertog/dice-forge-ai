import assert from "assert";
import { CommandLineInterface } from "./interfaces/cli";
import { DieFace } from "./dice/faces/DieFace";
import { GameRound } from "./GameRound";
import { Player } from "./Player";
import { ResolveMode } from "./ResolveMode";
import { divineBlessing, doReinforcements, resolveDieRolls } from "./util";

export class PlayerTurn{

    player: Player;
    round: GameRound;

    constructor(player: Player, round: GameRound) {
        this.player = player;
        this.round = round        
    }

    async play(): Promise<void> {
        this.round.game.currentPlayerTurn = this;
        await this.start();
        await doReinforcements(this.round.game, this.player);

        console.log(`${this.round.game}`);

        const playerAction = await this.player.getUserInterface().chooseAction(this.round.game, this.player);
        if(playerAction === undefined){
            return;
        }
        await playerAction(this.round.game, this.player);
        
        if (this.player.sun >= 2) {
            console.clear();
            if (await this.player.getUserInterface().extraTurn(this.round.game)) {
                this.player.addSun(-2);
                const secondPlayerAction = await this.player.getUserInterface().chooseAction(this.round.game, this.player);
                if(secondPlayerAction === undefined){
                    return;
                }
                await secondPlayerAction(this.round.game, this.player);
            }
        }
    }

    private async start(): Promise<void> {
        await this.everybodyReceivesDivineBlessing();

        if (this.round.game.players.length === 2) {
            await this.everybodyReceivesDivineBlessing();
        }
    }

    private async everybodyReceivesDivineBlessing(): Promise<Map<Player, DieFace[]>> {
        let rollsForPlayers = this.everybodyRolls();

        for (let player of this.round.game.players) {
            await resolveDieRolls(this.round.game, player, rollsForPlayers.get(player) as Array<DieFace>, ResolveMode.ADD);
        }
        return rollsForPlayers;
    }

    private everybodyRolls(): Map<Player, DieFace[]> {
        let rollsForPlayers = new Map<Player, DieFace[]>;

        for (let player of this.round.game.players) {
            let rolls = divineBlessing(player);
            rollsForPlayers.set(player, rolls);
        }

        return rollsForPlayers;
    }
}