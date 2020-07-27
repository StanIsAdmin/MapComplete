import { TagRenderingOptions } from "../TagRendering";
import { UIEventSource } from "../../UI/UIEventSource";
import { Changes } from "../../Logic/Changes";
import { Tag } from "../../Logic/TagsFilter";
import Translations from "../../UI/i18n/Translations";


export class OperatorTag extends TagRenderingOptions {

    private static to = Translations.t.other_questions.operator;
    private static options = {
        priority: 15,
        question: OperatorTag.to.question,
        freeform: {
            key: "operator",
            template: OperatorTag.to.template,
            renderTemplate: OperatorTag.to.render_template,
            placeholder: Translations.t.general.organisation
        },
        mappings: [
            { k: new Tag("operator", "Natuurpunt"), txt: OperatorTag.to.natuurpunt },
            { k: new Tag("operator", "Agentschap Natuur en Bos"), txt: OperatorTag.to.ANB },
            { k: new Tag("operator", "private"), txt: OperatorTag.to.private }
        ]
    }

    constructor() {
        super(OperatorTag.options);
    }

}