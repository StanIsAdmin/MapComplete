import { TagRenderingOptions } from "../TagRendering";
import { UIEventSource } from "../../UI/UIEventSource";
import { Changes } from "../../Logic/Changes";
import { And, Tag } from "../../Logic/TagsFilter";
import Translations from "../../UI/i18n/Translations";

export class AccessTag extends TagRenderingOptions {
    private static to = Translations.t.other_questions.access;
    private static options = {
        priority: 20,
        question: AccessTag.to.question,
        primer: AccessTag.to.primer,
        freeform: {
            key: "access:description",
            template: AccessTag.to.template,
            renderTemplate: AccessTag.to.render_template,
            placeholder: Translations.t.general.specify
        },
        mappings: [
            { k: new And([new Tag("access", "yes"), new Tag("fee", "")]), txt: AccessTag.to.yes },
            { k: new And([new Tag("access", "no"), new Tag("fee", "")]), txt: AccessTag.to.no },
            { k: new And([new Tag("access", "private"), new Tag("fee", "")]), txt: AccessTag.to.private },
            { k: new And([new Tag("access", "permissive"), new Tag("fee", "")]), txt: AccessTag.to.permissive },
            { k: new And([new Tag("access", "guided"), new Tag("fee", "")]), txt: AccessTag.to.guided },
            {
                k: new And([new Tag("access", "yes"),
                new Tag("fee", "yes")]),
                txt: AccessTag.to.with_payment,
                priority: 10
            },
        ]
    }

    constructor() {
        super(AccessTag.options);
    }


}