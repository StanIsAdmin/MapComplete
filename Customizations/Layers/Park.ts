import {LayerDefinition} from "../LayerDefinition";
import {And, Or, Tag} from "../../Logic/TagsFilter";
import {AccessTag} from "../Questions/AccessTag";
import {OperatorTag} from "../Questions/OperatorTag";
import {TagRenderingOptions} from "../TagRendering";
import {NameQuestion} from "../Questions/NameQuestion";
import {NameInline} from "../Questions/NameInline";
import {DescriptionQuestion} from "../Questions/DescriptionQuestion";
import {ImageCarouselWithUploadConstructor} from "../../UI/Image/ImageCarouselWithUpload";
import Translations from "../../UI/i18n/Translations";

export class Park extends LayerDefinition {

    private static to = Translations.t.walkbybrussels.park;
    private accessByDefault = new TagRenderingOptions({
        question: Park.to.accessibility.question,
        mappings: [
            { k: new Tag("access", "yes"), txt: Park.to.accessibility.yes},
            { k: new Tag("access", ""), txt: Park.to.accessibility.empty},
            { k: new Tag("access", "no"), txt: Park.to.accessibility.no},
            { k: new Tag("access", "private"), txt: Park.to.accessibility.private},
            { k: new Tag("access", "guided"), txt: Park.to.accessibility.guided},
        ],
        freeform: {
            key: "access",
            renderTemplate: Park.to.accessibility.freeform,
            template: Park.to.accessibility.template
        },
        priority: 20
    })

    private operatorByDefault = new

    TagRenderingOptions({
        question: Park.to.operator.question,
        freeform: {
            key: "operator",
            renderTemplate: Park.to.operator.freeform,
            template: "$$$",
        },
        mappings: [{
            k: null, txt: Park.to.operator.template
        }],
        priority: 15
    });


    constructor() {
        super();
        this.name = Park.to.name;
        this.icon = "assets/walkbybrussels/park.svg";
        this.overpassFilter =
            new Or([new Tag("leisure", "park"), new Tag("landuse", "village_green")]);
        this.newElementTags = [new Tag("leisure", "park"),
            new Tag("fixme", "Toegevoegd met MapComplete, geometry nog uit te tekenen")];
        this.maxAllowedOverlapPercentage = 25;

        this.minzoom = 13;
        this.style = this.generateStyleFunction();
        this.title = new NameInline(Park.to.name);
        this.elementsToShow = [
            new ImageCarouselWithUploadConstructor(),
            new NameQuestion(),
            this.accessByDefault,
            this.operatorByDefault,
            new DescriptionQuestion("park"),

        ];

    }




    private generateStyleFunction() {
        const self = this;
        return function (properties: any) {
            let questionSeverity = 0;
            for (const qd of self.elementsToShow) {
                if (qd instanceof DescriptionQuestion) {
                    continue;
                }
                if (qd.IsQuestioning(properties)) {
                    questionSeverity = Math.max(questionSeverity, qd.Priority() ?? 0);
                }
            }

            let colormapping = {
                0: "#00bb00",
                1: "#00ff00",
                10: "#dddd00",
                20: "#ff0000"
            };

            let colour = colormapping[questionSeverity];
            while (colour == undefined) {
                questionSeverity--;
                colour = colormapping[questionSeverity];
            }

            return {
                color: colour,
                icon: undefined
            };
        };
    }

}