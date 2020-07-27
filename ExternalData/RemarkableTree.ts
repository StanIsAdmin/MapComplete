import { Basemap } from "../Logic/Basemap";
import { IFeatureCollection, Parser } from "./Parser";
import L from "leaflet";
import {FeatureInfoBox} from "../UI/FeatureInfoBox";
import { UIEventSource } from "../UI/UIEventSource";
import { TagRenderingOptions } from "../Customizations/TagRendering";
import { ImageCarousel } from "../UI/Image/ImageCarousel";
import { SimpleImageElement } from "../UI/Image/SimpleImageElement";
import Translation from "../UI/i18n/Translation";


export class RemarkableTree {

    constructor(basemap: Basemap) {
        fetch("https://gis.urban.brussels/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typeName=BDU_DMS_PROT:Arbres_remarquables&srsName=EPSG:4326&outputFormat=json").then(res => res.json())
            .then(fc => {
                L.geoJSON(fc, {
                    style: function (feature) {
                        return {
                            icon: new L.icon({
                                iconUrl: "assets/bookcase.svg",
                                iconSize: [40, 40]
                            }),
                            color: "#0000ff"
                        }
                    },
                }).bindPopup(function (layer) {
                    let titles = new TagRenderingOptions({freeform: {key: "NOM_NL", renderTemplate: new Translation({nl: "Opmerkelijke boom", fr: "Arbre remarquable"}), template: ""}, });

                    let renderedTags = [
                        new TagRenderingOptions({freeform: {key: "FIRSTIMAGE", renderTemplate: new SimpleImageElement(new UIEventSource("{FIRSTIMAGE}")), template: ""}, }),
                        new TagRenderingOptions({freeform: {key: "NOM_NL", renderTemplate: new Translation({nl: "Naam: {NOM_NL}", fr: "Nom : {NOM_FR}"}), template: ""}, }),
                        new TagRenderingOptions({freeform: {key: "CIRCONFERENCE", renderTemplate: new Translation({nl: "Omtrek: {CIRCONFERENCE}", fr: "Circonférence : {CIRCONFERENCE}"}), template: ""}, }),
                    ]

                    return new FeatureInfoBox(undefined, layer.feature, new UIEventSource(layer.feature.properties),titles, renderedTags, undefined, undefined, undefined).Render();
                }).addTo(basemap.map);
            });

    }
}