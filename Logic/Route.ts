import L from "leaflet";

export class Route {
    public readonly waypoints: { lat: number, lon: number }[] = [];
    public readonly interests: string[];

    constructor(waypoints: { lat: number, lon: number }[], interests: string[]) {
        this.waypoints = waypoints;
        this.interests = interests;
    }

    public AddWaypoint(coord: { lat: number, lon: number }, interest: string = "") {
        this.waypoints.push(coord);
        console.log("Waypoints: ", this.waypoints);
        this.interests.push(interest);
        console.log("Interests: ", this.interests);
    }



}