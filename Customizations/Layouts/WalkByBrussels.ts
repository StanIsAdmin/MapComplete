import { Layout } from "../Layout";
import { DrinkingWater } from "../Layers/DrinkingWater";
import { NatureReserves } from "../Layers/NatureReserves";
import { Park } from "../Layers/Park";
import { Bench } from "../Layers/Bench";
import { Artwork } from "../Layers/Artwork";
import { Viewpoint } from "../Layers/Viewpoint";
import { ArtworkWBB } from "../Layers/ArtworkWBB";
import Translations from "../../UI/i18n/Translations";

export class WalkByBrussels extends Layout {
    constructor() {
        const to = Translations.t.walkbybrussels;
        super("walkbybrussels",
            ["en", "fr", "nl"],
            to.title,
            [new Park(), new NatureReserves(), new Viewpoint(), new Bench(), new DrinkingWater(), new ArtworkWBB()],
            10,
            50.8435,
            4.3688,


            "<h3>Drinking water</h3>\n" +
            "Help with creating a map of drinking water points!"
);
    }

}