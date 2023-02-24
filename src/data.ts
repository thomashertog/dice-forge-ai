import { DieFacePool } from "./dice/DieFacePool";
import { GloryPoints3 } from "./dice/faces/GloryPoints3";
import { GloryPoints4 } from "./dice/faces/GloryPoints4";
import { Gold2Moon1 } from "./dice/faces/Gold2Moon1";
import { Gold3 } from "./dice/faces/Gold3";
import { Gold4 } from "./dice/faces/Gold4";
import { Gold6 } from "./dice/faces/Gold6";
import { Moon1 } from "./dice/faces/Moon1";
import { Moon2 } from "./dice/faces/Moon2";
import { MoonGP2 } from "./dice/faces/MoonGP2";
import { MoonSunGoldGP1 } from "./dice/faces/MoonSunGoldGP1";
import { PickGold3GP2 } from "./dice/faces/PickGold3GP2";
import { PickGoldMoonSun1 } from "./dice/faces/PickGoldMoonSun1";
import { PickGoldMoonSun2 } from "./dice/faces/PickGoldMoonSun2";
import { Sun1 } from "./dice/faces/Sun1";
import { Sun1GP1 } from "./dice/faces/Sun1GP1";
import { Sun2 } from "./dice/faces/Sun2";
import { BlackmithsChest } from "./heroicfeats/BlacksmithsChest";
import { BlacksmithsHammer } from "./heroicfeats/blacksmithsHammer";
import { Cancer } from "./heroicfeats/Cancer";
import { Elder } from "./heroicfeats/Elder";
import { FerryMan } from "./heroicfeats/Ferryman";
import { Gorgon } from "./heroicfeats/Gorgon";
import { GuardiansOwl } from "./heroicfeats/GuardiansOwl";
import { HelmetOfInvisibility } from "./heroicfeats/HelmetOfInvisibility";
import { HeroicFeatPlatform } from "./heroicfeats/HeroicFeatPlatform";
import { Hydra } from "./heroicfeats/Hydra";
import { Minotaur } from "./heroicfeats/Minotaur";
import { MirrorOfTheAbyss } from "./heroicfeats/MirrorOfTheAbyss";
import { Satyrs } from "./heroicfeats/Satyrs";
import { SilverHind } from "./heroicfeats/SilverHind";
import { Sphinx } from "./heroicfeats/Sphinx";
import { WildSpirits } from "./heroicfeats/WildSpirits";

export const AllSanctuaryDieFaces: Array<DieFacePool> = new Array<DieFacePool>(
    new DieFacePool(2, [new Gold3(), new Gold3(), new Gold3(), new Gold3()]),
    new DieFacePool(2, [new Moon1(), new Moon1(), new Moon1(), new Moon1()]),
    new DieFacePool(3, [new Gold4(), new Gold4(), new Gold4(), new Gold4()]),
    new DieFacePool(3, [new Sun1(), new Sun1(), new Sun1(), new Sun1()]),
    new DieFacePool(4, [new PickGoldMoonSun1(), new Gold2Moon1(), new Sun1GP1(), new Gold6()]),
    new DieFacePool(5, [new PickGold3GP2(), new PickGold3GP2(), new PickGold3GP2(), new PickGold3GP2()]),
    new DieFacePool(6, [new Moon2(), new Moon2(), new Moon2(), new Moon2()]),
    new DieFacePool(8, [new Sun2(), new Sun2(), new Sun2(), new Sun2()]),
    new DieFacePool(8, [new GloryPoints3(), new GloryPoints3(), new GloryPoints3(), new GloryPoints3()]),
    new DieFacePool(12, [new PickGoldMoonSun2(), new GloryPoints4(), new MoonSunGoldGP1(), new MoonGP2()])
);

export const AllHeroicFeats: Array<HeroicFeatPlatform> = new Array<HeroicFeatPlatform>(
    new HeroicFeatPlatform("M1",
        new BlacksmithsHammer(), 
        new BlackmithsChest()),
    new HeroicFeatPlatform("M2",
        new SilverHind(),
        new Satyrs()),
    new HeroicFeatPlatform("M3",
        new FerryMan(),
        new HelmetOfInvisibility()),
    new HeroicFeatPlatform("E",
        new Cancer(),
        new Hydra(),
        new Sphinx()),
    new HeroicFeatPlatform("S1",
        new Elder(),
        new WildSpirits()),
    new HeroicFeatPlatform("S2",
        new GuardiansOwl(),
        new Minotaur()),
    new HeroicFeatPlatform("S3",
        new Gorgon(),
        new MirrorOfTheAbyss())
);
