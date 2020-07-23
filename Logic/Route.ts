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
        this.interests.push(interest);
    }

    public WaypointsAsString() {
        let res: string = "";
        for (let waypoint of this.waypoints) {
            res += waypoint.lat + Route.coordSeparator + waypoint.lon + Route.latlngSeparator;
        }
        return res.substr(0, res.length - 1);
    }

    public static RouteFromString(waypoints: string): Route {
        waypoints = decodeURIComponent(waypoints);
        if(waypoints === undefined){
            return new Route([], []);
        }
        let coordsString = waypoints.split(Route.latlngSeparator);
        let coords: { lat: number, lon: number }[] = [];
        let interests: string[] = [];
        for (let coord of coordsString) {
            let [lat, lon] = coord.split(Route.coordSeparator).map(parseFloat);
            if(isNaN(lat) || isNaN(lon)){
                return new Route([],[])
            }
            coords.push({ lat: lat, lon: lon })
            interests.push("");
        }
        return new Route(coords, interests);
    }

}