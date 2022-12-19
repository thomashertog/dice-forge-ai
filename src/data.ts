import { DieFacePool } from "./diefacepool";
import { DieFaceOption } from "./diefaceoption";

export const AllForgeDieFaces: Array<DieFacePool> = new Array<DieFacePool>(
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
