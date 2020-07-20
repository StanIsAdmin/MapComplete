import L from "leaflet";

export class Route {
    public readonly waypoints: { lat: number, lon: number }[] = [];

    constructor(waypoints: { lat: number, lon: number }[]) {
        this.waypoints = waypoints;
    }

}