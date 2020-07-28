import { LayerDefinition } from "../LayerDefinition";
import { And, Or, Tag } from "../../Logic/TagsFilter";
import { OperatorTag } from "../Questions/OperatorTag";
import * as L from "leaflet";
import FixedText from "../Questions/FixedText";
import { TagRenderingOptions } from "../TagRendering";
import { ImageCarouselWithUploadConstructor } from "../../UI/Image/ImageCarouselWithUpload";
import ArtworkType from "../Questions/walkbybrussels/ArtworkType";
import Translations from "../../UI/i18n/Translations";

export class ArtworkWBB extends LayerDefinition {

    constructor() {
        super();
        const to = Translations.t.walkbybrussels.artwork;
        this.name = to.name;
        this.icon = "./assets/walkbybrussels/streetart.svg";

        this.overpassFilter = new Or([
            new And([
                new Tag("tourism", "artwork")
            ])
        ]);


        this.newElementTags = [
            new Tag("tourism", "artwork"),
        ];
        this.maxAllowedOverlapPercentage = 10;

        this.minzoom = 13;
        this.style = this.generateStyleFunction();
        this.title = new FixedText(to.title);
        this.elementsToShow = [
            new ImageCarouselWithUploadConstructor(),
            new ArtworkType()
        ];

    }


    private generateStyleFunction() {
        const self = this;
        return function (properties: any) {

            return {
                color: "#00bb00",
                icon: {
                    iconUrl: self.icon,
                    iconSize: [40, 40]
                }
            };
        };
    }

}