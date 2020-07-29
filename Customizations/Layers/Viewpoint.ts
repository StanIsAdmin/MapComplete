import {LayerDefinition} from "../LayerDefinition";
import {FixedUiElement} from "../../UI/Base/FixedUiElement";
import FixedText from "../Questions/FixedText";
import {Tag} from "../../Logic/TagsFilter";
import {ImageCarouselWithUploadConstructor} from "../../UI/Image/ImageCarouselWithUpload";
import {TagRenderingOptions} from "../TagRendering";
import Translations from "../../UI/i18n/Translations";

export class Viewpoint extends LayerDefinition {

    constructor() {
        const to = Translations.t.walkbybrussels.viewpoint;
        super({
            name: to.name,
            description: to.description,
            newElementTags: [new Tag("tourism", "viewpoint"), new Tag("fixme", "Added with mapcomplete. This viewpoint should probably me merged with some existing feature")],
            icon: "assets/walkbybrussels/viewpoint.svg",
            wayHandling: LayerDefinition.WAYHANDLING_CENTER_ONLY,
            style: tags => {
                return {
                    color: undefined, icon:{
                        iconUrl: "assets/walkbybrussels/viewpoint.svg",
                        iconSize: [20, 20]
                    }
                }
            },
            maxAllowedOverlapPercentage: 0,
            overpassFilter: new Tag("tourism", "viewpoint"),
            minzoom: 13,
            title: new FixedText(to.name)
        });
        
        this.elementsToShow = [
            new FixedText(this.description),
            new ImageCarouselWithUploadConstructor(),
            new TagRenderingOptions({
                question: to.question,
                freeform:{
                    key: "description:0",
                    template: "$$$",
                    renderTemplate: to.renderTemplate
                }
            })
        ]
    }

}