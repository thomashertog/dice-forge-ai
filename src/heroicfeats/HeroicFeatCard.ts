import { CostType } from "../CostType";
import { Player } from "../Player";

export interface HeroicFeatCard{

    getCode(): string;
    getGloryPointsAtEndOfGame(): number;
    getCost(): number;
    getCostType(): CostType;

    canBeBoughtBy(player: Player): boolean;
}