import { LayerDefinition } from "../LayerDefinition";
import { And, Or, Tag } from "../../Logic/TagsFilter";
import { OperatorTag } from "../Questions/OperatorTag";
import * as L from "leaflet";
import FixedText from "../Questions/FixedText";
import {TagRenderingOptions} from "../TagRendering";
import {ImageCarouselWithUploadConstructor} from "../../UI/Image/ImageCarouselWithUpload";
import Translations from "../../UI/i18n/Translations";

export class DrinkingWater extends LayerDefinition {

    constructor() {
        super();
        const to = Translations.t.walkbybrussels.drinking_water;
        this.name = to.name;
        this.icon = "./assets/bike/drinking_water.svg";

        this.overpassFilter = new Or([
            new And([
                new Tag("amenity", "drinking_water")
            ])
        ]);


        this.newElementTags = [
            new Tag("amenity", "drinking_water"),
        ];
        this.maxAllowedOverlapPercentage = 10;
        this.wayHandling = LayerDefinition.WAYHANDLING_CENTER_AND_WAY

        this.minzoom = 13;
        this.style = this.generateStyleFunction();
        this.title = new FixedText(to.title);
        this.elementsToShow = [
            new OperatorTag(),
        ];
        this.elementsToShow = [
            new ImageCarouselWithUploadConstructor(),
            new TagRenderingOptions({
                question: to.bottle.question,
                mappings: [
                    { k: new Tag("bottle", "yes"), txt: to.bottle.yes },
                    { k: new Tag("bottle", "no"), txt: to.bottle.no }
                ],
            })];

    }


    private generateStyleFunction() {
        const self = this;
        return function (properties: any) {

            return {
                color: "#00bb00",
                icon: {
                    iconUrl: self.icon,
                    iconSize: [50, 50],
                    iconAnchor: [25,50]
                }
            };
        };
    }

}