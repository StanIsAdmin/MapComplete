import { Layout } from "../Layout";
import { DrinkingWater } from "../Layers/DrinkingWater";
import { NatureReserves } from "../Layers/NatureReserves";
import { Park } from "../Layers/Park";

export class WalkByBrussels extends Layout {
    constructor() {
        super("walkbybrussels",
            ["en","fr","nl"],
            "Drinking Water Spots",
            [new DrinkingWater(), new Park(), new NatureReserves()],
            10,
            50.8435,
            4.3688,


            "        <h3>Drinking water</h3>\n" +
            "Help with creating a map of drinking water points!"
);
    }

}