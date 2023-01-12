import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class GuardiansOwl extends AbstractHeroicFeatCard implements ReinforcementEffect{

    constructor(){
        super(2, CostType.SUN);
    }

    handleReinforcement(): void {
        //TODO
    }

    getGloryPointsAtEndOfGame(): number {
        return 4;
    }
}
