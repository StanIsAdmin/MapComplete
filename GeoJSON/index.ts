export abstract class GeoJSON {
	private readonly type: string;
	private readonly bbox: Array<number> | undefined;

	constructor(type: string, bbox?: Array<number>) {
		if (bbox && bbox.length % 2 !== 0) {
			throw new Error("Invalid bbox");
		}
		this.type = type;
		this.bbox = bbox;
	}

	/**
	 * Convert GeoJSON object to GeoJSON text
	 * 
	 * @return
	 */
	toGeoJSONText(): string {
		return JSON.stringify(this.toGeoJSONObject());
	}

	toGeoJSONObject(): object {
		return this.bbox ? { bbox: this.bbox } : {};
	}

	getBbox(): Array<number> | undefined {
		return this.bbox;
	}

	getType(): string {
		return this.type;
	}

	toString(): string {
		return this.toGeoJSONText();
	}
}

export abstract class Geometry extends GeoJSON {

	constructor(type: string) {
		super(type);
	}

	abstract getCoordinates(): object;

	toGeoJSONObject() {
		let geometry: object = {
			type: this.getType(), coordinates: this.getCoordinates(),
			...super.toGeoJSONObject(),
		}
		return geometry;
	}

}

export class Point extends Geometry {
	private readonly coordinates: Array<number>;

	constructor(...coordinates: Array<number>) {
		super("Point");
		if (coordinates.length < 2 || coordinates.length > 3) throw new Error("This is not a valid Point!")
		this.coordinates = coordinates;
	}

	getLat(): number {
		return this.coordinates[1];
	}

	getLon(): number {
		return this.coordinates[0];
	}

    /**
     * Returns the elevation.
     */
	getAlt(): undefined | number {
		return this.coordinates[2];
	}

	getCoordinates(): object {
		return this.coordinates;
	}

}

export class Multi<T> extends Geometry {
	private readonly coordinates: Array<T>;

	constructor(type: string, coordinates?: Array<T>) {
		super(type);
		this.coordinates = coordinates || new Array<T>();
	}

	add(list: T): Multi<T> {
		this.coordinates.push(list);
		return this;
	}

	getCoordinates(): object {
		return this.coordinates;
	}
}

export class MultiPoint extends Multi<Point> {
	constructor(points?: Array<Point>) {
		super("MultiPoint", points);
	}
}

export class LineString extends Multi<Point> {
	constructor(points?: Array<Point>) {
		super("LineString", points);
	}
}

export class MultiLineString extends Multi<LineString> {
	constructor(lineStrings?: Array<LineString>) {
		super("MultiLineString", lineStrings);
	}
}

export class Polygon extends Multi<Array<Point>> {
	constructor(lists?: Array<Array<Point>>) {
		super("Polygon", lists);
	}
}

export class MultiPolygon extends Multi<Polygon> {
	constructor(polygons?: Array<Polygon>) {
		super("Polygon", polygons);
	}
}

export class Feature extends GeoJSON {
	private readonly geometry: Geometry | undefined;
	private readonly id: string | undefined;
	private readonly properties: object | undefined;
	// TODO add properties field (The value of the properties member is an object (any JSON object or a JSON null value).)

	constructor(id?: string, geometry?: Geometry, bbox?: Array<number>, properties?: object) {
		super("Feature", bbox);
		this.geometry = geometry;
		this.id = id;
		this.properties = properties;
	}

	getGeometry(): Geometry | undefined {
		return this.geometry;
	}

	toGeoJSONObject() {
		let feature: object = {
			geometry: this.geometry ? this.geometry.toGeoJSONObject() : null,
			...super.toGeoJSONObject()
		};
		this.id && (feature['id'] = this.id);
		return feature;
	}
}

export class FeatureCollection extends GeoJSON {
	private readonly features: Array<Feature>;

	constructor(features?: Array<Feature>, bbox?: Array<number>) {
		super("FeatureCollection", bbox);
		this.features = features || [];
	}

	add(feature: Feature): FeatureCollection {
		this.features.push(feature);
		return this;
	}

	toGeoJSONObject() {
		let features: object = {
			features: this.features.map(f => f.toGeoJSONObject()),
			...super.toGeoJSONObject()
		}
		return features;
	}
}

export class BoundingBox {
	private readonly bbox: Array<number>;

	constructor(bbox?: Array<number>) {
		if (!bbox || bbox.length % 2 !== 0) {
			throw new Error("Invalid bbox");
		}
		this.bbox = bbox;
	}

	getBbox() {
		return this.bbox;
	}
}