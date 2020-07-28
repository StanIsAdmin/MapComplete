import { Basemap } from "../Logic/Basemap";
import { IFeatureCollection, Parser } from "./Parser";
import L from "leaflet";
import { FeatureInfoBox } from "../UI/FeatureInfoBox";
import { UIEventSource } from "../UI/UIEventSource";
import { TagRenderingOptions } from "../Customizations/TagRendering";
import { ImageCarousel } from "../UI/Image/ImageCarousel";
import { SimpleImageElement } from "../UI/Image/SimpleImageElement";
import Translation from "../UI/i18n/Translation";
import Translations from "../UI/i18n/Translations";
import { BaseLayerDefinition } from "../Customizations/LayerDefinition";

export class RemarkableTree extends BaseLayerDefinition {

    private readonly translations = Translations.t.walkbybrussels.remarkableTrees;

    constructor() {
        super();
        this.name = 'Remarkable Trees';
        this.description = "Outstanding trees, worth a look!";
        this.minzoom = 13;
        this.style = function (tags) {
            return {
                icon: {
                    iconSize: [40, 40],
                    iconUrl: "assets/walkbybrussels/tree.svg",
                },
                color: "#0000ff"
            };

        }
        this.title = new TagRenderingOptions({ freeform: { key: "NOM_NL", renderTemplate: this.translations.title, template: "" }, });
        this.icon = "assets/walkbybrussels/tree.svg";
        this.elementsToShow = [
            new TagRenderingOptions({ freeform: { key: "FIRSTIMAGE", renderTemplate: new SimpleImageElement(new UIEventSource("{FIRSTIMAGE}")), template: "" }, }),
            new TagRenderingOptions({ freeform: { key: "NOM_NL", renderTemplate: this.translations.name, template: "" }, }),
            new TagRenderingOptions({ freeform: { key: "CIRCONFERENCE", renderTemplate: this.translations.circumference, template: "" }, }),
        ];

        this.data = this.getData();
        // fetch("https://gis.urban.brussels/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typeName=BDU_DMS_PROT:Arbres_remarquables&srsName=EPSG:4326&outputFormat=json").then(res => res.json())
        //     .then(fc => {
        //         L.geoJSON(fc, {
        //             pointToLayer: function (feature, latlng) {
        //                 return L.marker(latlng, {
        //                     icon: new L.Icon({
        //                         iconSize: [27, 27],
        //                         iconAnchor: [13, 27],
        //                         popupAnchor: [-1, -27],
        //                         iconUrl: "./assets/walkbybrussels/tree.svg",
        //                     })
        //                 });
        //             }
        //         }).bindPopup((layer) => {
        //             let titles = new TagRenderingOptions({ freeform: { key: "NOM_NL", renderTemplate: this.translations.title, template: "" }, });

        //             let renderedTags = [
        //                 new TagRenderingOptions({ freeform: { key: "FIRSTIMAGE", renderTemplate: new SimpleImageElement(new UIEventSource("{FIRSTIMAGE}")), template: "" }, }),
        //                 new TagRenderingOptions({ freeform: { key: "NOM_NL", renderTemplate: this.translations.name, template: "" }, }),
        //                 new TagRenderingOptions({ freeform: { key: "CIRCONFERENCE", renderTemplate: this.translations.circumference, template: "" }, }),
        //             ]

        //             return new FeatureInfoBox(undefined, layer.feature, new UIEventSource(layer.feature.properties), titles, renderedTags, undefined, undefined, undefined).Render();
        //         }).addTo(basemap.map);
        //     });

    }

    private async getData() {
        let res = await fetch("https://gis.urban.brussels/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typeName=BDU_DMS_PROT:Arbres_remarquables&srsName=EPSG:4326&outputFormat=json");
        return res.json();
    }
}