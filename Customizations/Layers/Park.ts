import { LayerDefinition } from "../LayerDefinition";
import { Quests } from "../../Quests";
import { And, Or, Tag } from "../../Logic/TagsFilter";
import { AccessTag } from "../Questions/AccessTag";
import { OperatorTag } from "../Questions/OperatorTag";
import { TagRenderingOptions } from "../TagRendering";
import { NameQuestion } from "../Questions/NameQuestion";
import { NameInline } from "../Questions/NameInline";
import { DescriptionQuestion } from "../Questions/DescriptionQuestion";
import { ImageCarouselWithUploadConstructor } from "../../UI/Image/ImageCarouselWithUpload";
import Translations from "../../UI/i18n/Translations";
import FixedText from "../Questions/FixedText";


export class Park extends LayerDefinition {


    private accessByDefault = new TagRenderingOptions({
        question: Translations.t.walkbybrussels.park.accessibility.question,
        mappings: [
            { k: new Tag("access", "yes"), txt: Translations.t.walkbybrussels.park.accessibility.yes },
            { k: new Tag("access", ""), txt: Translations.t.walkbybrussels.park.accessibility.empty },
            { k: new Tag("access", "no"), txt: Translations.t.walkbybrussels.park.accessibility.no },
            { k: new Tag("access", "private"), txt: Translations.t.walkbybrussels.park.accessibility.private },
            { k: new Tag("access", "guided"), txt: Translations.t.walkbybrussels.park.accessibility.guided },
        ],
        freeform: {
            key: "access",
            renderTemplate: Translations.t.walkbybrussels.park.accessibility.freeform,
            template: Translations.t.walkbybrussels.park.accessibility.template
        },
        priority: 20
    })

    private operatorByDefault = new

        TagRenderingOptions({
            question: Translations.t.walkbybrussels.park.operator.question,
            freeform: {
                key: "operator",
                renderTemplate: Translations.t.walkbybrussels.park.operator.freeform,
                template: "$$$",
            },
            mappings: [{
                k: null, txt: Translations.t.walkbybrussels.park.operator.template
            }],
            priority: 15
        });


    constructor() {
        super();
        const to = Translations.t.walkbybrussels.park;
        this.name = to.name;
        this.icon = "./assets/tree_white_background.svg";
        this.overpassFilter =
            new Or([new Tag("leisure", "park"), new Tag("landuse", "village_green")]);
        this.newElementTags = [new Tag("leisure", "park"),
        new Tag("fixme", "Toegevoegd met MapComplete, geometry nog uit te tekenen")];
        this.maxAllowedOverlapPercentage = 25;

        this.minzoom = 13;
        this.style = this.generateStyleFunction();
        this.title = new FixedText(to.name);
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