import { FeatureCollection, BoundingBox, Feature, Geometry, Point } from '../GeoJSON';
import proj4 from "proj4";
import osmgeojson from "osm-and-geojson";

export class Parser {
    private readonly src: string;
    private readonly config: IFeatureCollection;
    private fc: FeatureCollection;

    constructor(src: string, config: IFeatureCollection) {
        this.src = src;
        this.config = config;
    }

    async parse() {
        let parser = new DOMParser();
        let res = await fetch(this.src, { headers: { "Content-Type": "application/xml" } });
        let data = await res.text();
        let doc = parser.parseFromString(data, "application/xml");
        this.fc = this.featureCollection(doc.getElementsByTagName(this.config.tagName)[0])
        return this.fc;
    }

    toOSM() {
        const clone = JSON.parse(JSON.stringify(this.fc));
        clone.features.forEach(element => {
            const flatten = this.flattenObject(element.properties);
            element.properties = flatten;
        });
        return osmgeojson.geojson2osm(clone);
    }

    //#Source https://bit.ly/2neWfJ2 
    private flattenObject = (obj, prefix = '') =>
        Object.keys(obj).reduce((acc, k) => {
            const pre = prefix.length ? prefix + '_' : '';
            if (typeof obj[k] === 'object') Object.assign(acc, this.flattenObject(obj[k], pre + k));
            else acc[pre + k] = obj[k];
            return acc;
        }, {});

    private featureCollection(featureCollection: Element): FeatureCollection {
        const fc = new FeatureCollection(undefined, this.bbox(featureCollection.getElementsByTagName(this.config.bbox.tagName)[0]).getBbox());
        let featureElts = featureCollection.getElementsByTagName(this.config.feature.tagName);
        for (let featureElt of featureElts) {
            fc.add(this.feature(featureElt));
        }

        return fc;
    }

    private feature(featureElt: Element): Feature {
        let extractedProps = {};
        let { nl, fr } = this.config;
        let { geometry, id } = this.config.feature;
        for (let [lang, props] of Object.entries({ nl, fr })) {
            extractedProps[lang] = this.extractProps(props, featureElt);
        }
        return new Feature(featureElt.getAttribute(id) || undefined,
            this.geometry(featureElt.getElementsByTagName(geometry.tagName)[0]),
            this.bbox(featureElt.getElementsByTagName(this.config.bbox.tagName)[0]).getBbox(), extractedProps);
    }

    private geometry(geometryElt: Element): Geometry {
        if (!geometryElt) return;
        let geometryTypeElt = geometryElt.firstElementChild;

        let { point } = this.config.feature.geometry;

        switch (geometryTypeElt.nodeName) {
            case point.tagName:
                return this.point(geometryTypeElt);
        }
    }

    private point(pointElt: Element): Point {
        if (!pointElt) return;
        let coordinates = this.coordinates(pointElt.getElementsByTagName(this.config.feature.geometry.point.coordinates.tagName)[0])
        return new Point(...coordinates);
    }

    private bbox(boundedBy: Element): BoundingBox {
        if (!boundedBy) return;
        let { coordinates, lowerCorner, upperCorner } = this.config.bbox;
        if (lowerCorner && upperCorner) {
            let lowCorner = boundedBy.getElementsByTagName(lowerCorner.tagName)[0];
            let upCorner = boundedBy.getElementsByTagName(upperCorner.tagName)[0];
            return new BoundingBox(this.coordinates(lowCorner).concat(this.coordinates(upCorner)));
        }

        if (coordinates) {

        }
    }

    private coordinates(coordinatesElt: Element): Array<number> {
        if (!coordinatesElt) return;
        let coordinates = coordinatesElt.textContent.replace(/,/g, " ").split(" ").map<number>(parseFloat);
        return this.config.isLambert72 ? this.fromLambert72ToWGS84(coordinates) : coordinates;
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


export interface IFeatureCollection extends ITagName {
    feature: IFeature;
    bbox?: IBBox;
    isLambert72?: boolean;
    nl?: IProperties;
    fr?: IProperties;
}

interface IPosition {
    tagName: string;
}

interface IPoint extends ITagName {
    coordinates: IPosition;
}

interface IBBox extends ITagName {
    coordinates?: IPosition;
    lowerCorner?: IPosition;
    upperCorner?: IPosition;
}

interface IGeometry extends ITagName {
    point?: IPoint;
}

interface IFeature extends ITagName {
    geometry?: IGeometry;
    id?: string;
}

interface ITagName {
    tagName?: string;
}

interface IProperties {
    name?: string;
    description?: string;
    picture?: string;
    address?: object;
    extra?: object;
    [propName: string]: any
}