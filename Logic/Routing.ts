import * as $ from "jquery";

/**
 * Interfaces routing.anyways.eu to get routes between waypoints
 */
export class Routing {
    private _queryPrefix = "https://routing.anyways.eu/api/route?";
    private _queryOptions: string
    private _queryApiKey = "&api-key=mwK4irCD1whXx1XEpLQN6qotuM6P-Rh8";

    constructor(profile: string = "pedestrian.shortest") {
        this._queryOptions = "&profile=" + profile;
    }

    private buildQuery(locations: { lat: number, lon: number }[]) {
        return this._queryPrefix
            + locations.map(loc => { return "loc=" + loc.lon + "," + loc.lat; }).join("&")
            + this._queryOptions + this._queryApiKey;
    }


    queryRoute(locations: { lat: number, lon: number }[], continuation: ((any) => void), onFail: ((reason) => void)): void {
        if (locations.length < 2) {
            return;
        }
        let query = this.buildQuery(locations);

        $.getJSON(query,
            function (json, status) {
                if (status !== "success") {
                    console.log("Query failed")
                    onFail(status);
                }

                if (json.elements === [] && json.remarks.indexOf("runtime error") > 0) {
                    console.log("Timeout or other runtime error");
                    return;
                }

                continuation(json);
            }).fail(onFail)

            ;
    }


}