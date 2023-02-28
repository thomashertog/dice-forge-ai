import { DieFace } from "./dice/faces/DieFace";
import { GameRound } from "./GameRound";
import { Player } from "./Player";
import { ResolveMode } from "./ResolveMode";
import { questionUntilValidAnswer } from "./util";

export class PlayerTurn{

    player: Player;
    round: GameRound;

    constructor(player: Player, round: GameRound) {
        this.player = player;
        this.round = round        
    }

    async play(): Promise<void> {
        console.clear();
        await this.start();
        console.log(`starting turn for ${this.player.name} in round ${this.round.count}`);
        await this.player.doReinforcements();
        let executed = await this.player.takeTurn();
        if (this.player.sun >= 2 && executed === true) {
            console.clear();
            let extraTurn =
                (await questionUntilValidAnswer(`
${this.player}\n
${this.round.game.sanctuary}\n
${this.round.game.heroicFeats}\n
Would you like to perform an extra action for 2 sun shards? Yes (Y) / No (N)`,
                    "Y", "N")).toUpperCase();
            if (extraTurn === "Y") {
                this.player.addSun(-2);
                await this.player.takeTurn();
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
            await player.resolveDieRolls(rollsForPlayers.get(player) as Array<DieFace>, ResolveMode.ADD);
        }
        return rollsForPlayers;
    }

    private everybodyRolls(): Map<Player, DieFace[]> {
        let rollsForPlayers = new Map<Player, DieFace[]>;

        for (let player of this.round.game.players) {
            let rolls = player.divineBlessing();
            rollsForPlayers.set(player, rolls);
        }

        return rollsForPlayers;
    }
}