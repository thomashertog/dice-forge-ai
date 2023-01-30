import { DieFacePool } from "./DieFacePool";
import { DieFaceOption } from "./DieFaceOption";
import { BlacksmithsHammer } from "./heroicfeats/blacksmithsHammer";
import { BlackmithsChest } from "./heroicfeats/BlacksmithsChest";
import { Cancer } from "./heroicfeats/Cancer";
import { Elder } from "./heroicfeats/Elder";
import { FerryMan } from "./heroicfeats/Ferryman";
import { Gorgon } from "./heroicfeats/Gorgon";
import { GuardiansOwl } from "./heroicfeats/GuardiansOwl";
import { HelmetOfInvisibility } from "./heroicfeats/HelmetOfInvisibility";
import { HeroicFeatPortal } from "./heroicfeats/HeroicFeatPortal";
import { Hydra } from "./heroicfeats/Hydra";
import { Minotaur } from "./heroicfeats/Minotaur";
import { MirrorOfTheAbyss } from "./heroicfeats/MirrorOfTheAbyss";
import { Satyrs } from "./heroicfeats/Satyrs";
import { SilverHind } from "./heroicfeats/SilverHind";
import { Sphinx } from "./heroicfeats/Sphinx";
import { WildSpirits } from "./heroicfeats/WildSpirits";

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
    new HeroicFeatPortal("M1",
        new BlacksmithsHammer(), 
        new BlackmithsChest()),
    new HeroicFeatPortal("M2",
        new SilverHind(),
        new Satyrs()),
    new HeroicFeatPortal("M3",
        new FerryMan(),
        new HelmetOfInvisibility()),
    new HeroicFeatPortal("E",
        new Cancer(),
        new Hydra(),
        new Sphinx()),
    new HeroicFeatPortal("S1",
        new Elder(),
        new WildSpirits()),
    new HeroicFeatPortal("S2",
        new GuardiansOwl(),
        new Minotaur),
    new HeroicFeatPortal("S3",
        new Gorgon(),
        new MirrorOfTheAbyss())
);
