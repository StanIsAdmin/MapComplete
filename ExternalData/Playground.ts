import { Basemap } from "../Logic/Basemap";
import { IFeatureCollection, Parser } from "./Parser";
import L from "leaflet";
import { FeatureInfoBox } from "../UI/FeatureInfoBox";
import { UIEventSource } from "../UI/UIEventSource";
import { FixedUiElement } from "../UI/Base/FixedUiElement";
import { TagRenderingOptions } from "../Customizations/TagRendering";
import Translation from "../UI/i18n/Translation";
import Translations from "../UI/i18n/Translations";
import { BaseLayerDefinition } from "../Customizations/LayerDefinition";


export class Playground extends BaseLayerDefinition {

    private readonly config: IFeatureCollection = {
        tagName: "wfs:FeatureCollection",
        bbox: {
            tagName: "gml:boundedBy",
            lowerCorner: { tagName: "gml:lowerCorner" },
            upperCorner: { tagName: "gml:upperCorner" }
        },
        feature: {
            tagName: "wfs:member",
            geometry: {
                tagName: "BELB:msGeometry",
                point: {
                    tagName: "gml:Point",
                    coordinates: { tagName: "gml:pos" }
                }
            }
        },
        isLambert72: true,
        properties: {
            name: "BELB:nom", nl_description: "BELB:descriptie", fr_description: "BELB:description", zipCode: "BELB:adresse_zip", street: "BELB:adresse_txt", nl_municipality: "BELB:gemeente", nl_age: "BELB:leeftijd",
            fr_municipality: "BELB:commune", fr_age: "BELB:age"
        }
    }

    private readonly translations = Translations.t.walkbybrussels.playgrounds;

    constructor() {
        super();
        const to = Translations.t.walkbybrussels.playgrounds;
        this.name = to.title;
        this.description = to.description;
        this.minzoom = 13;
        this.style = function (tags) {
            return {
                icon: {
                    iconSize: [40, 40],
                    iconUrl: "assets/walkbybrussels/playground_black.svg",
                },
                color: "#0000ff"
            };

        }
        this.title = new TagRenderingOptions({ freeform: { key: 'name', renderTemplate: this.translations.title, template: '' } });
        this.icon = "assets/walkbybrussels/playground_black.svg";
        this.elementsToShow = [
            new TagRenderingOptions({ freeform: { key: "name", renderTemplate: this.translations.name, template: "" } }),
            new TagRenderingOptions({ freeform: { key: "nl_description", renderTemplate: this.translations.description, template: "" }, }),
            new TagRenderingOptions({ freeform: { key: "street", renderTemplate: this.translations.street, template: "" } }),
            new TagRenderingOptions({ freeform: { key: "zipCode", renderTemplate: this.translations.zipCode, template: "" } }),
            new TagRenderingOptions({ freeform: { key: "nl_municipality", renderTemplate: this.translations.municipality, template: "" } }),
            new TagRenderingOptions({ freeform: { key: "nl_age", renderTemplate: this.translations.age, template: "" } }),
        ];
        let parser = new Parser("https://cors-anywhere.herokuapp.com/https://wfs.environnement.brussels/belb?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=playground&SRSNAME=EPSG:31370", this.config);
        this.data = parser.parse();
    }
}