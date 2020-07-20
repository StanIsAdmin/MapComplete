import L from "leaflet";
import { UIEventSource } from "../UI/UIEventSource";
import { Route } from "./Route";
import { Basemap } from "./Basemap";
import { Routing } from "./Routing";

export class RouteLayer {
    private _route: UIEventSource<Route>;
    private _bm: Basemap;
    private _routing: Routing;
    private _layer: L.Layer;

    constructor(route: UIEventSource<Route>, bm: Basemap) {
        this._route = route;
        this._bm = bm;
        this._routing = new Routing();
        this.renderOnMap.bind(this);
        const self = this;
        route.addCallback(() => self.renderOnMap());
    }

    private renderOnMap() {
        const self = this;
        self._routing.queryRoute(self._route.data.waypoints, (geo) => {
            if (self._layer) {
                self._bm.map.removeLayer(self._layer);
            }
            self._layer = L.geoJSON(geo);
            self._layer.addTo(self._bm.map)
        }, console.log);
    }

}