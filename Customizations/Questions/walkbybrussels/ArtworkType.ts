import { TagRenderingOptions } from "../../TagRendering";
import { Tag } from "../../../Logic/TagsFilter";
import Translations from "../../../UI/i18n/Translations";


export default class ArtworkType extends TagRenderingOptions {
    constructor() {
        const to = Translations.t.walkbybrussels.artwork.type;
        super({
            priority: 5,
            question: to.question,
            freeform: {
                key: "artwork_type",
                extraTags: new Tag("fixme", "Freeform artwork_type= tag used: possibly a wrong value"),
                template: to.template,
                renderTemplate: to.render,
                placeholder: Translations.t.cyclofix.freeFormPlaceholder,
            },
            mappings: [
                { k: new Tag("artwork_type", "architecture"), txt: to.architecture },
                { k: new Tag("artwork_type", "mural"), txt: to.mural },
                { k: new Tag("artwork_type", "painting"), txt: to.painting },
                { k: new Tag("artwork_type", "sculpture"), txt: to.sculpture },
                { k: new Tag("artwork_type", "statue"), txt: to.statue },
                { k: new Tag("artwork_type", "bust"), txt: to.bust },
                { k: new Tag("artwork_type", "stone"), txt: to.stone },
                { k: new Tag("artwork_type", "installation"), txt: to.installation },
                { k: new Tag("artwork_type", "graffiti"), txt: to.graffiti },
                { k: new Tag("artwork_type", "relief"), txt: to.relief },
                { k: new Tag("artwork_type", "azulejo"), txt: to.azulejo },
                { k: new Tag("artwork_type", "tilework"), txt: to.tilework }
            ]
        });
    }
}