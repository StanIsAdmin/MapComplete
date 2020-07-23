import { Basemap } from "../Logic/Basemap";
import { IFeatureCollection, Parser } from "./Parser";
import L from "leaflet";
import {FeatureInfoBox} from "../UI/FeatureInfoBox";
import { UIEventSource } from "../UI/UIEventSource";
import { TagRenderingOptions } from "../Customizations/TagRendering";
import { ImageCarousel } from "../UI/Image/ImageCarousel";
import { SimpleImageElement } from "../UI/Image/SimpleImageElement";


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
                    let lang = "nl";

                    let titles = {
                        nl: new TagRenderingOptions({freeform: {key: "title", renderTemplate: "Opmerkelijke boom", template: ""}, }),
                        fr: new TagRenderingOptions({freeform: {key: "title", renderTemplate: "Arbre remarquable", template: ""}, })

                    }

                    let renderedTags = {nl:[
                        new TagRenderingOptions({freeform: {key: "FIRSTIMAGE", renderTemplate: new SimpleImageElement(new UIEventSource("{FIRSTIMAGE}")), template: ""}, }),
                        new TagRenderingOptions({freeform: {key: "NOM_NL", renderTemplate: "Naam: {NOM_NL}", template: ""}, }),
                    ], fr: [
                        new TagRenderingOptions({freeform: {key: "FIRSTIMAGE", renderTemplate: new SimpleImageElement(new UIEventSource("{FIRSTIMAGE}")), template: ""}, }),
                        new TagRenderingOptions({freeform: {key: "NOM_FR", renderTemplate: "Non: {NOM_FR}", template: ""}, }),
                    ]};
                    return new FeatureInfoBox(layer.feature, new UIEventSource(layer.feature.properties),titles[lang], renderedTags[lang], undefined, undefined).Render();
                }).addTo(basemap.map);
            });

    }
}