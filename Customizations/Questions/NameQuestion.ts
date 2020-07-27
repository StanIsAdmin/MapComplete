/**
 * There are two ways to ask for names:
 * One is a big 'name-question', the other is the 'edit name' in the title.
 * THis one is the big question
 */
import { TagRenderingOptions } from "../TagRendering";
import { Tag } from "../../Logic/TagsFilter";
import Translations from "../../UI/i18n/Translations";
import Combine from "../../UI/Base/Combine";

export class NameQuestion extends TagRenderingOptions {
    private static to = Translations.t.other_questions.name_question;
    static options = {
        priority: 10, // Move this last on the priority list, in order to prevent ppl to enter access restrictions and descriptions
        question: new Combine([NameQuestion.to.question, "<br><span class='question-subtext'>", NameQuestion.to.question_subtext, "</span>"]),
        freeform: {
            key: "name",
            template: NameQuestion.to.template,
            renderTemplate: "", // We don't actually render it, only ask
            placeholder: "",
            extraTags: new Tag("noname", "")
        },
        mappings: [
            { k: new Tag("noname", "yes"), txt: NameQuestion.to.noname },
        ]
    }

    constructor() {
        super(NameQuestion.options);
    }

}