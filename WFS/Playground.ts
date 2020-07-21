import { Basemap } from "../Logic/Basemap";
import { IFeatureCollection, Parser } from "./Parser";
import L from "leaflet";

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
        nl: { name: "BELB:nom", description: "BELB:descriptie", address: { zipCode: "BELB:adresse_zip", street: "BELB:adresse_txt", municipality: "BELB:gemeente" }, extra: { age: "BELB:leeftijd" } },
        fr: { name: "BELB:nom", description: "BELB:description", address: { zipCode: "BELB:adresse_zip", street: "BELB:adresse_txt", municipality: "BELB:commune" }, extra: { age: "BELB:age" } }
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
                    return JSON.stringify(layer.feature.properties);
                }).addTo(basemap.map);
            });

    }
}