import { Basemap } from "../Logic/Basemap";
import { IFeatureCollection, Parser } from "./Parser";
import L from "leaflet";
import {FeatureInfoBox} from "../UI/FeatureInfoBox";
import { UIEventSource } from "../UI/UIEventSource";
import { FixedUiElement } from "../UI/Base/FixedUiElement";
import { TagRenderingOptions } from "../Customizations/TagRendering";
import Translation from "../UI/i18n/Translation";


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
        properties: { name: "BELB:nom", nl_description: "BELB:descriptie", fr_description: "BELB:description", zipCode: "BELB:adresse_zip", street: "BELB:adresse_txt", nl_municipality: "BELB:gemeente", nl_age: "BELB:leeftijd",
            fr_municipality: "BELB:commune", fr_age: "BELB:age" }
    }

    constructor(basemap: Basemap) {
        let parser = new Parser("https://cors-anywhere.herokuapp.com/https://wfs.environnement.brussels/belb?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=playground&SRSNAME=EPSG:31370", this.config);
        parser.parse()
            .then(fc => {
                console.log(fc);
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
                    let renderedTags = [
                        new TagRenderingOptions({freeform: {key: "name", renderTemplate: new Translation({nl: "Naam: {name}", fr: "Nom : {name}"}), template: ""}}), 
                        new TagRenderingOptions({freeform: {key: "nl_description", renderTemplate: new Translation({nl: "Descriptie: {nl_description}", fr: "Description : {fr_description}"}), template: ""}, }),
                        new TagRenderingOptions({freeform: {key: "street", renderTemplate: new Translation({nl:"Straat: {street}", fr: "Rue : {street}"}), template: ""}}),
                        new TagRenderingOptions({freeform: {key: "zipCode", renderTemplate: new Translation({nl:"Postcode: {zipCode}", fr: "Code postal : {zipCode}"}), template: ""}}),
                        new TagRenderingOptions({freeform: {key: "nl_municipality", renderTemplate: new Translation({nl:"Gemeente: {nl_municipality}", fr: "Commune :  {fr_municipality}"}), template: ""}}),
                        new TagRenderingOptions({freeform: {key: "nl_age", renderTemplate: new Translation({nl: "Leeftijd: {nl_age}", fr: "Age : {fr_age}"}), template: ""}}),
                    ];
                    return new FeatureInfoBox(undefined, layer.feature, new UIEventSource(layer.feature.properties),new FixedUiElement("playground"),renderedTags, undefined, undefined, undefined).Render();
                }).addTo(basemap.map);
            });

    }
}