import { Layout } from "../Layout";
import { DrinkingWater } from "../Layers/DrinkingWater";
import { NatureReserves } from "../Layers/NatureReserves";
import { Park } from "../Layers/Park";
import { Playground } from "../../ExternalData/Playground";
import { RemarkableTree } from "../../ExternalData/RemarkableTree";
import { Bench } from "../Layers/Bench";
import { Artwork } from "../Layers/Artwork";
import { Viewpoint } from "../Layers/Viewpoint";
import { ArtworkWBB } from "../Layers/ArtworkWBB";
import Translations from "../../UI/i18n/Translations";
import Combine from "../../UI/Base/Combine";

export class WalkByBrussels extends Layout {
    constructor() {
        const to = Translations.t.walkbybrussels;
        super("walkbybrussels",
            ["en", "fr", "nl"],
            to.title,
            [new Park(), new NatureReserves(), new Viewpoint(), new Bench(), new DrinkingWater(), new ArtworkWBB(), new Playground(), new RemarkableTree()],
            14,
            50.8435,
            4.3688,
            new Combine(["<h3>",Translations.t.walkbybrussels.title,"</h3>", Translations.t.walkbybrussels.description])
        );
    }

}