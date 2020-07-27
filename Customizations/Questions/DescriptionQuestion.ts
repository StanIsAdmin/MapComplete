import { TagRenderingOptions } from "../TagRendering";
import Translations from "../../UI/i18n/Translations";
import Combine from "../../UI/Base/Combine";
import Translation from "../../UI/i18n/Translation";


export class DescriptionQuestion extends TagRenderingOptions {

    constructor(category: Translation) {
        super({
            question: new Combine([Translations.t.walkbybrussels.park.description.question, category, "?<br>",
                "<span class='question-subtext'>", Translations.t.walkbybrussels.park.description.question_subtext, "</span>"]),
            freeform: {
                key: "description:0",
                renderTemplate: "{description:0}",
                template: "$$$"
            },
            priority: 14
        });
    }

}