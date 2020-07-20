import {UIElement} from "./UIElement";
import {UserDetails} from "../Logic/OsmConnection";
import {UIEventSource} from "./UIEventSource";
import {Basemap} from "../Logic/Basemap";
import L from "leaflet";
import {FixedUiElement} from "./Base/FixedUiElement";

/**
 * Handles and updates the user badge
 */
export class UserBadge extends UIElement {
    private _userDetails: UIEventSource<UserDetails>;
    private _pendingChanges: UIElement;
    private _logout: UIElement;
    private _basemap: Basemap;


    constructor(userDetails: UIEventSource<UserDetails>,
                pendingChanges: UIElement,
                basemap: Basemap) {
        super(userDetails);
        this._userDetails = userDetails;
        this._pendingChanges = pendingChanges;
        this._basemap = basemap;

        this._logout = new FixedUiElement("<img src='assets/logout.svg' class='small-userbadge-icon' alt='logout'>")
            .onClick(() => {
                userDetails.data.osmConnection.LogOut();
            });

        userDetails.addCallback(function () {
            const profilePic = document.getElementById("profile-pic");
            if (profilePic) {

                profilePic.onload = function () {
                    profilePic.style.opacity = "1"
                };
            }
        });

    }

    protected InnerRender(): string {
        const user = this._userDetails.data;
        if (!user.loggedIn) {
            return "<div class='activate-osm-authentication'>Klik hier om aan te melden bij OSM</div>";
        }
        
        
        let messageSpan = "<span id='messages'>" +
            "     <a href='https://www.openstreetmap.org/messages/inbox' target='_blank'><img class='small-userbadge-icon' src='./assets/envelope.svg' alt='msgs'>" +
            user.totalMessages +
            "</a></span>";

        if (user.unreadMessages > 0) {
            messageSpan = "<span id='messages' class='alert'>" +
                "     <a href='https://www.openstreetmap.org/messages/inbox' target='_blank'><img class='small-userbadge-icon' src='./assets/envelope.svg' alt='msgs'/>" +
                " " +
                "" +
                user.unreadMessages.toString() +
                "</a></span>";
        }

        let dryrun = "";
        if (user.dryRun) {
            dryrun = " <span class='alert'>TESTING</span>";
        }

        let home = "";
        if (user.home !== undefined) {
            home = "<img id='home' src='./assets/home.svg' alt='home' class='small-userbadge-icon'> ";
            const icon = L.icon({
                iconUrl: 'assets/home.svg',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            L.marker([user.home.lat, user.home.lon], {icon: icon}).addTo(this._basemap.map);
        }

        const settings =
            "<a href='https://www.openstreetmap.org/user/" + encodeURIComponent(user.name) + "/account' target='_blank'>" +
            "<img class='small-userbadge-icon' src='./assets/gear.svg' alt='settings'>" +
            "</a> ";

        return "<div id='test'><img id='profile-pic' src='" + user.img + "' alt='profile-pic'/></div> " +
            "<div id='usertext'>" +
            "<p id='username'>" +
            "<a href='https://www.openstreetmap.org/user/" + user.name + "' target='_blank'>" + user.name + "</a>" +
            dryrun +
            "</p> " +
            "<p id='userstats'>" +
            home +
            settings +
            messageSpan +
            "<span id='csCount'> " +
            "   <a href='https://www.openstreetmap.org/user/" + user.name + "/history' target='_blank'><img class='small-userbadge-icon' src='./assets/star.svg' alt='star'/> " + user.csCount +
            "</a></span> " +
            this._logout.Render() +
            this._pendingChanges.Render() +
            "</p>" +
       
            "</div>";
    }

    InnerUpdate(htmlElement: HTMLElement) {
        this._pendingChanges.Update();
        var btn = document.getElementById("home");
        if (btn) {
            const self = this;
            btn.onclick = function () {
                const home = self._userDetails?.data?.home;
                if (home === undefined) {
                    return;
                }
                self._basemap.map.flyTo([home.lat, home.lon], 18);

            }
        }
        this._logout.Update();
    }
    
    Activate() {
        this._pendingChanges.Activate();
    }

}