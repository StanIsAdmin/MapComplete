import { GeoJSON, FeatureCollection, BoundingBox, Feature, Geometry, Point } from '../GeoJSON';
import { Basemap } from '../Logic/Basemap';
import L from "leaflet";
import proj4 from "proj4";

export class WFSLayer {

    propsToExtract = {
        'nl': { name: "BELB:nom", description: "BELB:descriptie", address: { zipCode: "BELB:adresse_zip", street: "BELB:adresse_txt", municipality: "BELB:gemeente" }, extra: { age: "BELB:leeftijd" } },
        'fr': { name: "BELB:nom", description: "BELB:description", address: { zipCode: "BELB:adresse_zip", street: "BELB:adresse_txt", municipality: "BELB:commune" }, extra: { age: "BELB:age" } }
    };

    private baseMap: Basemap;


    constructor(baseMap: Basemap) {
        let parser = new DOMParser();
        fetch("https://cors-anywhere.herokuapp.com/https://wfs.environnement.brussels/belb?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=playground&SRSNAME=EPSG:31370", { headers: { "Content-Type": "application/xml" } }).then(res => res.text()).then(text => {
            let doc = parser.parseFromString(text, "application/xml");
            this.featureCollection(doc.getElementsByTagName("wfs:FeatureCollection")[0]);
        });

        this.baseMap = baseMap;
    }

    private featureCollection(featureCollection: Element) {
        const fc = new FeatureCollection(undefined, this.bbox(featureCollection.getElementsByTagName("wfs:boundedBy")[0]).getBbox());
        let featureElts = featureCollection.getElementsByTagName("wfs:member");
        for (let featureElt of featureElts) {
            fc.add(this.feature(featureElt));
        }

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
        }).addTo(this.baseMap.map);
    }

    private feature(featureElt: Element): Feature {
        let extractedProps = {};
        for (let [lang, props] of Object.entries(this.propsToExtract)) {
            extractedProps[lang] = this.extractProps(props, featureElt);
        }
        return new Feature(undefined,
            this.geometry(featureElt.getElementsByTagName("BELB:msGeometry")[0]),
            this.bbox(featureElt.getElementsByTagName("gml:boundedBy")[0]).getBbox(), extractedProps);
    }

    private geometry(geometryElt: Element): Geometry {
        let geometryTypeElt = geometryElt.firstElementChild;
        switch (geometryTypeElt.nodeName) {
            case "gml:Point":
                return this.point(geometryTypeElt);
        }
    }

    private point(pointElt: Element): Point {
        let coordinates = this.coordinates(pointElt.getElementsByTagName("gml:pos")[0])
        return new Point(...coordinates);
    }

    private bbox(boundedBy: Element): BoundingBox {
        let lowerCorner = boundedBy.getElementsByTagName("gml:lowerCorner")[0];
        let upperCorner = boundedBy.getElementsByTagName("gml:upperCorner")[0];
        return new BoundingBox(this.coordinates(lowerCorner).concat(this.coordinates(upperCorner)));
    }

    private coordinates(coordinates: Element): Array<number> {
        if (!coordinates) return;
        return this.fromLambert72ToWGS84(coordinates.textContent.replace(/,/g, " ").split(" ").map<number>(parseFloat));
    }

    private extractProps(propsToExtract, extractFrom: Element): object {
        let extractedProps = {};
        for (let [key, value] of Object.entries(propsToExtract)) {
            if (value instanceof Object) {
                extractedProps[key] = this.extractProps(value, extractFrom);
            } else {
                extractedProps[key] = extractFrom.getElementsByTagName(value)[0].textContent;
            }
        }

        return extractedProps;
    }

    private fromLambert72ToWGS84(coordinates: Array<number>): Array<number> {
        return proj4("+proj=lcc +lat_1=51.16666723333334 +lat_2=49.83333389999999 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-99.1,53.3,-112.5,0.419,-0.83,1.885,-1.0 +units=m +no_defs")
            .inverse(coordinates);
    }
}


export interface WFSInterface {
    featureCollectionTagName: string;
    featureTagName: string;
    bboxTagName: string;
    geometryTagName: string;
    pointTagName: string;
    posTagName?: string;
    coordinatesTagName?: string;
    lowerCornerTagName?: string;
    upperCornerTagName?: string;
    isLambert72?: boolean;
    // TODO add missing tag types
}