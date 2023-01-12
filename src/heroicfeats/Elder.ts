import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class Elder extends AbstractHeroicFeatCard implements ReinforcementEffect{

    constructor(){
        super(1, CostType.SUN);
    }

    handleReinforcement(): void {
        //TODO
    }

    getGloryPointsAtEndOfGame(): number {
        return 0;
    }
}
