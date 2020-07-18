import { GeoJSON, FeatureCollection, BoundingBox, Feature, Geometry, Point } from '../GeoJSON';

export class Parser {

    propsToExtract = {
        'nl': { zipCode: "BELB:adresse_zip", street: "BELB:adresse_txt", municipality: "BELB:gemeente", name: "BELB:nom", description: "BELB:descriptie", extra: { age: "BELB:leeftijd" } },
        'fr': { zipCode: "BELB:adresse_zip", street: "BELB:adresse_txt", municipality: "BELB:commune", name: "BELB:nom", description: "BELB:description", extra: { age: "BELB:age" } }
    };

    constructor() {
        let parser = new DOMParser();
        fetch("https://cors-anywhere.herokuapp.com/https://wfs.environnement.brussels/belb?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=playground&SRSNAME=EPSG:31370", { headers: { "Content-Type": "application/xml" } }).then(res => res.text()).then(text => {
            let doc = parser.parseFromString(text, "application/xml");
            this.featureCollection(doc.getElementsByTagName("wfs:FeatureCollection")[0]);
        });
    }

    private featureCollection(featureCollection: Element) {
        const fc = new FeatureCollection(undefined, this.bbox(featureCollection.getElementsByTagName("wfs:boundedBy")[0]).getBbox());
        let featureElts = featureCollection.getElementsByTagName("wfs:member");
        for (let featureElt of featureElts) {
            fc.add(this.feature(featureElt));
        }
        console.log(JSON.stringify(fc));
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
        return coordinates.textContent.replace(/,/g, " ").split(" ").map<number>(parseFloat);
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
}