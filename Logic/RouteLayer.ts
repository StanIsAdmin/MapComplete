import L from "leaflet";

export class RouteLayer {
    private _layer: L.Layer;
    private _editable: boolean;

    constructor(geo = {}, editable = true) {
        this._layer = L.geoJSON(geo)
    }

    // TODO: handle click events to add waypoints (as GeoJSON features)

    public asLayer() {
        return this._layer;
    }

}