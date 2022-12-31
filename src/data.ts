import { DieFacePool } from "./diefacepool";
import { DieFaceOption } from "./diefaceoption";
import { HeroicFeatCard, HeroicFeatPortal } from "./heroicfeatcard";
import { CostType, HeroicFeatCardType } from "./heroicfeatcardtype";

export const AllSanctuaryDieFaces: Array<DieFacePool> = new Array<DieFacePool>(
    new DieFacePool(2, [DieFaceOption.GOLD_3, DieFaceOption.GOLD_3, DieFaceOption.GOLD_3, DieFaceOption.GOLD_3]),
    new DieFacePool(2, [DieFaceOption.MOON_1, DieFaceOption.MOON_1, DieFaceOption.MOON_1, DieFaceOption.MOON_1]),
    new DieFacePool(3, [DieFaceOption.GOLD_4, DieFaceOption.GOLD_4, DieFaceOption.GOLD_4, DieFaceOption.GOLD_4]),
    new DieFacePool(3, [DieFaceOption.SUN_1, DieFaceOption.SUN_1, DieFaceOption.SUN_1, DieFaceOption.SUN_1]),
    new DieFacePool(4, [DieFaceOption.PICK_GOLD_MOON_SUN_1, DieFaceOption.GOLD_2_MOON_1, DieFaceOption.SUN_1_GP_1, 
                        DieFaceOption.GOLD_6]),
    new DieFacePool(5, [DieFaceOption.PICK_GOLD_3_GP_2, DieFaceOption.PICK_GOLD_3_GP_2, 
                        DieFaceOption.PICK_GOLD_3_GP_2, DieFaceOption.PICK_GOLD_3_GP_2]),
    new DieFacePool(6, [DieFaceOption.MOON_2, DieFaceOption.MOON_2, DieFaceOption.MOON_2, DieFaceOption.MOON_2]),
    new DieFacePool(8, [DieFaceOption.SUN_2, DieFaceOption.SUN_2, DieFaceOption.SUN_2, DieFaceOption.SUN_2]),
    new DieFacePool(8, [DieFaceOption.GP_3, DieFaceOption.GP_3, DieFaceOption.GP_3, DieFaceOption.GP_3]),
    new DieFacePool(12, [DieFaceOption.PICK_GOLD_MOON_SUN_2, DieFaceOption.GP_4, DieFaceOption.MOON_SUN_GOLD_GP_1, 
                         DieFaceOption.MOON_GP_2])
);

export const AllHeroicFeats: Array<HeroicFeatPortal> = new Array<HeroicFeatPortal>(
    new HeroicFeatPortal(
        new HeroicFeatCard(1, CostType.MOON, HeroicFeatCardType.BLACKSMITHS_HAMMER), 
        new HeroicFeatCard(1, CostType.MOON, HeroicFeatCardType.BLACKSMITHS_CHEST)),
    new HeroicFeatPortal(
        new HeroicFeatCard(2, CostType.MOON, HeroicFeatCardType.SILVER_HIND),
        new HeroicFeatCard(3, CostType.MOON, HeroicFeatCardType.SATYRS)),
    new HeroicFeatPortal(
        new HeroicFeatCard(4, CostType.MOON, HeroicFeatCardType.FERRYMAN),
        new HeroicFeatCard(5, CostType.MOON, HeroicFeatCardType.HELMET_OF_INVISIBILITY)),
    new HeroicFeatPortal(
        new HeroicFeatCard(6, CostType.MOON, HeroicFeatCardType.CANCER),
        new HeroicFeatCard(5, CostType.BOTH, HeroicFeatCardType.HYDRA),
        new HeroicFeatCard(6, CostType.SUN, HeroicFeatCardType.SPHINX)),
    new HeroicFeatPortal(
        new HeroicFeatCard(1, CostType.SUN, HeroicFeatCardType.THE_ELDER),
        new HeroicFeatCard(1, CostType.SUN, HeroicFeatCardType.WILD_SPIRITS)),
    new HeroicFeatPortal(
        new HeroicFeatCard(2, CostType.SUN, HeroicFeatCardType.GUARDIANS_OWL),
        new HeroicFeatCard(3, CostType.SUN, HeroicFeatCardType.MINOTAUR)),
    new HeroicFeatPortal(
        new HeroicFeatCard(4, CostType.SUN, HeroicFeatCardType.GORGON),
        new HeroicFeatCard(5, CostType.SUN, HeroicFeatCardType.MIRROR_OF_THE_ABYSS))
);
