import { LayerDefinition } from "../LayerDefinition";
import { And, Or, Tag } from "../../Logic/TagsFilter";
import { OperatorTag } from "../Questions/OperatorTag";
import * as L from "leaflet";
import FixedText from "../Questions/FixedText";
import Translations from "../../UI/i18n/Translations";

export class Viewpoint extends LayerDefinition {

    constructor() {
        super();
        const to = Translations.t.walkbybrussels.viewpoint;
        this.name = to.name;
        this.icon = "./assets/walkbybrussels/viewpoint.svg";

        this.overpassFilter = new Or([
            new And([
                new Tag("tourism", "viewpoint")
            ])
        ]);


        this.newElementTags = [
            new Tag("tourism", "viewpoint"),
        ];
        this.maxAllowedOverlapPercentage = 10;

        this.minzoom = 13;
        this.style = this.generateStyleFunction();
        this.title = new FixedText(to.title);
        this.elementsToShow = [
        ];

    }


    private generateStyleFunction() {
        const self = this;
        return function (properties: any) {

            return {
                color: "#00bb00",
                icon: new L.icon({
                    iconUrl: self.icon,
                    iconSize: [40, 40]
                })
            };
        };
    }

}