import { Basemap } from "../Logic/Basemap";
import { IFeatureCollection, Parser } from "./Parser";
import L from "leaflet";
import {FeatureInfoBox} from "../UI/FeatureInfoBox";
import { UIEventSource } from "../UI/UIEventSource";
import { FixedUiElement } from "../UI/Base/FixedUiElement";
import { TagRenderingOptions } from "../Customizations/TagRendering";


export class Playground {

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
        nl: { name: "BELB:nom", description: "BELB:descriptie", zipCode: "BELB:adresse_zip", street: "BELB:adresse_txt", municipality: "BELB:gemeente", age: "BELB:leeftijd" },
        fr: { name: "BELB:nom", description: "BELB:description", zipCode: "BELB:adresse_zip", street: "BELB:adresse_txt", municipality: "BELB:commune", age: "BELB:age" }
    }

    constructor(basemap: Basemap) {
        let parser = new Parser("https://cors-anywhere.herokuapp.com/https://wfs.environnement.brussels/belb?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=playground&SRSNAME=EPSG:31370", this.config);
        parser.parse()
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

                    let renderedTags = {nl:[
                        new TagRenderingOptions({freeform: {key: "description", renderTemplate: "Descriptie: {description}", template: ""}, }),
                        new TagRenderingOptions({freeform: {key: "street", renderTemplate: "Straat: {street}", template: ""}}),
                        new TagRenderingOptions({freeform: {key: "zipCode", renderTemplate: "Postcode: {zipCode}", template: ""}}),
                        new TagRenderingOptions({freeform: {key: "municipality", renderTemplate: "Gemeente: {municipality}", template: ""}}),
                        new TagRenderingOptions({freeform: {key: "age", renderTemplate: "Leeftijd: {age}", template: ""}}),
                    ], fr: [
                        new TagRenderingOptions({freeform: {key: "description", renderTemplate: "Description: {description}", template: ""}, }),
                        new TagRenderingOptions({freeform: {key: "street", renderTemplate: "Rue: {street}", template: ""}}),
                        new TagRenderingOptions({freeform: {key: "zipCode", renderTemplate: "Code postal: {zipCode}", template: ""}}),
                        new TagRenderingOptions({freeform: {key: "municipality", renderTemplate: "Commune: {municipality}", template: ""}}),
                        new TagRenderingOptions({freeform: {key: "age", renderTemplate: "Age: {age}", template: ""}}),
                    ]};
                    return new FeatureInfoBox(layer.feature, new UIEventSource(layer.feature.properties[lang]),new TagRenderingOptions({freeform: {key: "name", renderTemplate: "{name}", template: ""}}), renderedTags[lang], undefined, undefined).Render();
                }).addTo(basemap.map);
            });

    }
}