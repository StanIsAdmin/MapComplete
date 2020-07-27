import { TagRenderingOptions } from "../TagRendering";
import Translations from "../../UI/i18n/Translations";


export class DescriptionQuestion extends TagRenderingOptions {

    constructor(category: string) {
        super({
            question: Translations.t.walkbybrussels.park.description.question + category + "?<br>" +
                "<span class='question-subtext'>Je hoeft niet te herhalen wat je net hebt aangeduid.<br/>" +
                "Een <i>naam</i> wordt in de volgende stap gevraagd.<br/>" +
                "Voel je vrij om dit veld over te slaan.</span>",
            freeform: {
                key: "description:0",
                renderTemplate: "{description:0}",
                template: "$$$"
            },
            priority: 14
        });
    }

}