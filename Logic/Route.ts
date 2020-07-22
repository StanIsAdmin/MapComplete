import L from "leaflet";

export class Route {
    private static latlngSeparator = ",";
    private static coordSeparator = ";";
    public readonly waypoints: { lat: number, lon: number }[] = [];
    public readonly interests: string[];

    constructor(waypoints: { lat: number, lon: number }[], interests: string[]) {
        this.waypoints = waypoints;
        this.interests = interests;
    }

    public AddWaypoint(coord: { lat: number, lon: number }, interest: string = "") {
        this.waypoints.push(coord);
        console.log("Waypoints: ", this.WaypointsAsString());
        console.log(Route.RouteFromString(this.WaypointsAsString()))
        this.interests.push(interest);
        console.log("Interests: ", this.interests);
    }

    public WaypointsAsString() {
        let res: string = "";
        for (let waypoint of this.waypoints) {
            res += waypoint.lat + Route.coordSeparator + waypoint.lon + Route.latlngSeparator;
        }
        return res.substr(0, res.length - 1);
    }

    public static RouteFromString(waypoints: string): Route {
        let coordsString = waypoints.split(this.latlngSeparator);
        let coords: { lat: number, lon: number }[] = [];
        let interests: string[] = [];
        for (let coord of coordsString) {
            let [lat, lon] = coord.split(Route.coordSeparator);
            coords.push({ lat: Number(lat), lon: Number(lon) })
            interests.push("");
        }
        return new Route(coords, interests);
    }

}