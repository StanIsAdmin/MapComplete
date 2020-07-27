import { LayerDefinition } from "../LayerDefinition";
import { Or, Tag } from "../../Logic/TagsFilter";
import { TagRenderingOptions } from "../TagRendering";
import { AccessTag } from "../Questions/AccessTag";
import { OperatorTag } from "../Questions/OperatorTag";
import { NameQuestion } from "../Questions/NameQuestion";
import { NameInline } from "../Questions/NameInline";
import { DescriptionQuestion } from "../Questions/DescriptionQuestion";
import { ImageCarouselWithUploadConstructor } from "../../UI/Image/ImageCarouselWithUpload";
import Translations from "../../UI/i18n/Translations";
import FixedText from "../Questions/FixedText";

export class NatureReserves extends LayerDefinition {

    constructor(moreQuests: boolean = false) {
        super();
        const to = Translations.t.walkbybrussels.nature_reserve;
        this.name = to.name;
        this.icon = "./assets/tree_white_background.svg";
        this.overpassFilter =
            new Or([new Tag("leisure", "nature_reserve"), new Tag("boundary", "protected_area")]);
        this.maxAllowedOverlapPercentage = 10;

        this.newElementTags = [new Tag("leisure", "nature_reserve"),
        new Tag("fixme", "Toegevoegd met MapComplete, geometry nog uit te tekenen")]
        this.minzoom = 13;
        this.title = new FixedText(to.name);
        this.style = this.generateStyleFunction();
        this.elementsToShow = [
            new ImageCarouselWithUploadConstructor(),
            new TagRenderingOptions({
                freeform: {
                    key: "_surface",
                    renderTemplate: "{_surface}m²",
                    template: "$$$"
                }
            }),
            new NameQuestion(),
            new AccessTag(),
            new OperatorTag(),
            new DescriptionQuestion("natuurgebied")
        ];


        const extraRenderings = [
            new TagRenderingOptions({
                question: to.dogs.question,
                mappings: [
                    { k: new Tag("dog", "leashed"), txt: to.dogs.leashed },
                    { k: new Tag("dog", "no"), txt: to.dogs.no },
                    { k: new Tag("dog", "yes"), txt: to.dogs.yes },
                ]
            }).OnlyShowIf(new Tag("access", "yes")),
            new TagRenderingOptions({
                question: to.website.question,
                freeform: {
                    key: "website",
                    renderTemplate: "<a href='{website}' target='_blank'>" + to.website.more_info + "</a>",
                    template: "$$$"
                }
            }),
            new TagRenderingOptions({
                question: to.curator.question + "<br>" +
                    "<span class='question-subtext'>" + to.curator.question_subtext + "</span>",
                freeform: {
                    renderTemplate: to.curator.template,
                    template: "$$$",
                    key: "curator"
                }
            }),
            new TagRenderingOptions(
                {
                    question: to.administrator.question + "<br>" +
                        "<span class='question-subtext'>" + to.administrator.question_subtext + "</span>",
                    freeform: {
                        renderTemplate: to.administrator.template,
                        template: "$$$",
                        key: "email"
                    }
                }),
            new TagRenderingOptions(
                {
                    question: to.phone.question + "<br>" +
                        "<span class='question-subtext'>" + to.phone.question_subtext + "</span>",
                    freeform: {
                        renderTemplate: to.phone.template,
                        template: "$$$",
                        key: "phone"
                    }
                }),

        ];

        if (moreQuests) {
            this.elementsToShow =
                this.elementsToShow.concat(extraRenderings);
        }


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