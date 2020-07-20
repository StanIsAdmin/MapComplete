import { OsmConnection } from "./Logic/OsmConnection";
import { Changes } from "./Logic/Changes";
import { ElementStorage } from "./Logic/ElementStorage";
import { UIEventSource } from "./UI/UIEventSource";
import { UserBadge } from "./UI/UserBadge";
import { Basemap } from "./Logic/Basemap";
import { PendingChanges } from "./UI/PendingChanges";
import { CenterMessageBox } from "./UI/CenterMessageBox";
import { Helpers } from "./Helpers";
import { Tag, TagUtils } from "./Logic/TagsFilter";
import { FilteredLayer } from "./Logic/FilteredLayer";
import { LayerUpdater } from "./Logic/LayerUpdater";
import { UIElement } from "./UI/UIElement";
import { MessageBoxHandler } from "./UI/MessageBoxHandler";
import { Overpass } from "./Logic/Overpass";
import { FeatureInfoBox } from "./UI/FeatureInfoBox";
import { GeoLocationHandler } from "./Logic/GeoLocationHandler";
import { StrayClickHandler } from "./Logic/StrayClickHandler";
import { SimpleAddUI } from "./UI/SimpleAddUI";
import { VariableUiElement } from "./UI/Base/VariableUIElement";
import { SearchAndGo } from "./UI/SearchAndGo";
import { CollapseButton } from "./UI/Base/CollapseButton";
import { AllKnownLayouts } from "./Customizations/AllKnownLayouts";
import { All } from "./Customizations/Layouts/All";




// --------------------- Read the URL parameters -----------------

// @ts-ignore
if (location.href.startsWith("http://buurtnatuur.be")) {
    // Reload the https version. This is important for the 'locate me' button
    window.location.replace("https://buurtnatuur.be");
}


let dryRun = false;

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {

    // Set to true if testing and changes should NOT be saved
    dryRun = true;
    // If you have a testfile somewhere, enable this to spoof overpass
    // This should be hosted independantly, e.g. with `cd assets; webfsd -p 8080` + a CORS plugin to disable cors rules
    Overpass.testUrl = null; // "http://127.0.0.1:8080/test.json";
}


// ----------------- SELECT THE RIGHT QUESTSET -----------------


let defaultQuest = "buurtnatuur"

for (const k in AllKnownLayouts.allSets) {
    const layout = AllKnownLayouts.allSets[k];
    const possibleParts = layout.locationContains ?? [];
    console.log(layout.locationContains)
    for (const locationMatch of possibleParts) {
        if (locationMatch === "") {
            continue
        }
        console.log(layout.name, " -> ", locationMatch, window.location.href.indexOf(locationMatch))
        if (window.location.href.toLowerCase().indexOf(locationMatch.toLowerCase()) >= 0) {
            defaultQuest = layout.name;
            console.log("Detected a default by URL: ", layout.name, "matches", locationMatch)
        }
    }
}

if (window.location.search) {
    const params = window.location.search.substr(1).split("&");
    const paramDict: any = {};
    for (const param of params) {
        var kv = param.split("=");
        paramDict[kv[0]] = kv[1];
    }
    if (paramDict.quests) {
        defaultQuest = paramDict.quests
    }
    if (paramDict.test) {
        dryRun = true;
    }
}

const questSetToRender = AllKnownLayouts.allSets[defaultQuest];
console.log("Using quests: ", questSetToRender.name);

document.title = questSetToRender.title;


// ----------------- Setup a few event sources -------------


// The message that should be shown at the center of the screen
const centerMessage = new UIEventSource<string>("");

// The countdown: if set to e.g. ten, it'll start counting down. When reaching zero, changes will be saved. NB: this is implemented later, not in the eventSource
const secondsTillChangesAreSaved = new UIEventSource<number>(0);

const leftMessage = new UIEventSource<() => UIElement>(undefined);

const selectedElement = new UIEventSource<any>(undefined);


const locationControl = new UIEventSource<{ lat: number, lon: number, zoom: number }>({
    zoom: questSetToRender.startzoom,
    lat: questSetToRender.startLat,
    lon: questSetToRender.startLon
});


// ----------------- Prepare the important objects -----------------

const saveTimeout = 30000; // After this many milliseconds without changes, saves are sent of to OSM
const allElements = new ElementStorage();
const osmConnection = new OsmConnection(dryRun);
const changes = new Changes(
    "Beantwoorden van vragen met #MapComplete voor vragenset #" + questSetToRender.name,
    osmConnection, allElements);
const bm = new Basemap("leafletDiv", locationControl, new VariableUiElement(
    locationControl.map((location) => {
        const mapComplete = "<a href='https://github.com/pietervdvn/MapComplete' target='_blank'>Mapcomple</a> " +
            " " +
            "<a href='https://github.com/pietervdvn/MapComplete/issues' target='_blank'><img src='./assets/bug.svg' alt='Report bug'  class='small-userbadge-icon'></a>";
        let editHere = "";
        if (location !== undefined) {
            editHere = " | " +
                "<a href='https://www.openstreetmap.org/edit?editor=id#map=" + location.zoom + "/" + location.lat + "/" + location.lon + "' target='_blank'>" +
                "<img src='./assets/pencil.svg' alt='edit here' class='small-userbadge-icon'>" +
                "</a>"
        }
        return mapComplete + editHere;

    })
));


// ------------- Setup the layers -------------------------------
const controls = {};
const addButtons: {
    name: string,
    icon: string,
    tags: Tag[],
    layerToAddTo: FilteredLayer
}[]
    = [];

const flayers: FilteredLayer[] = []

let minZoom = 0;

for (const layer of questSetToRender.layers) {

    const generateInfo = (tagsES) => {

        return new FeatureInfoBox(
            tagsES,
            layer.title,
            layer.elementsToShow,
            changes,
            osmConnection.userDetails
        )
    };

    minZoom = Math.max(minZoom, layer.minzoom);

    const flayer = layer.asLayer(bm, allElements, changes, osmConnection.userDetails, selectedElement,
        generateInfo);

    controls[layer.name] = flayer.isDisplayed;

    const addButton = {
        name: layer.name,
        icon: layer.icon,
        tags: layer.newElementTags,
        layerToAddTo: flayer
    }
    addButtons.push(addButton);
    flayers.push(flayer);
}

const layerUpdater = new LayerUpdater(bm, minZoom, flayers);


// ------------------ Setup various UI elements ------------


new StrayClickHandler(bm, selectedElement, leftMessage, () => {
    return new SimpleAddUI(bm.Location,
        bm.LastClickLocation,
        changes,
        selectedElement,
        layerUpdater.runningQuery,
        osmConnection.userDetails,
        addButtons);
}
);

/**
 * Show the questions and information for the selected element on the leftMessage
 */
selectedElement.addCallback((data) => {
    // Which is the applicable set?
    for (const layer of questSetToRender.layers) {

        const applicable = layer.overpassFilter.matches(TagUtils.proprtiesToKV(data));
        if (applicable) {
            // This layer is the layer that gives the questions
            leftMessage.setData(() =>
                new FeatureInfoBox(
                    allElements.getElement(data.id),
                    layer.title,
                    layer.elementsToShow,
                    changes,
                    osmConnection.userDetails
                ));
            break;
        }
    }
}
);


const pendingChanges = new PendingChanges(
    changes.pendingChangesES, secondsTillChangesAreSaved, changes.isSaving);

new UserBadge(osmConnection.userDetails, pendingChanges, bm)
    .AttachTo('userbadge');

new SearchAndGo(bm).AttachTo("searchbox");

new CollapseButton("messagesbox")
    .AttachTo("collapseButton");

var welcomeMessage = () => {
    return new VariableUiElement(
        osmConnection.userDetails.map((userdetails) => {
            var login = questSetToRender.gettingStartedPlzLogin;
            if (userdetails.loggedIn) {
                login = questSetToRender.welcomeBackMessage;
            }
            return "<div id='welcomeMessage'>" +
                questSetToRender.welcomeMessage + login + questSetToRender.welcomeTail +
                "</div>";
        }),
        function () {
            osmConnection.registerActivateOsmAUthenticationClass()
        });
}
leftMessage.setData(welcomeMessage);
welcomeMessage().AttachTo("messagesbox");


var messageBox = new MessageBoxHandler(leftMessage, () => { selectedElement.setData(undefined) });

new CenterMessageBox(
    minZoom,
    centerMessage,
    osmConnection,
    locationControl,
    layerUpdater.runningQuery)
    .AttachTo("centermessage");


Helpers.SetupAutoSave(changes, secondsTillChangesAreSaved, saveTimeout);
Helpers.LastEffortSave(changes);

osmConnection.registerActivateOsmAUthenticationClass();


new GeoLocationHandler(bm).AttachTo("geolocate-button");


// --------------- Send a ping to start various action --------

locationControl.ping();
messageBox.update();

// SMALL TEST OF ROUTE CREATION AND DISPLAY
import { RouteLayer } from "./Logic/RouteLayer";
import { Route } from "./Logic/Route";


locationControl.data.lat = 50.812962;
locationControl.data.lon = 4.387968;
locationControl.ping();

let route = new Route([{ lat: 50.812962, lon: 4.387968 }, { lat: 50.811115, lon: 4.381334 }]);
let event = new UIEventSource(route);
let layer = new RouteLayer(event, bm);
event.ping();
setTimeout(function () { route.waypoints.push({ lat: 50.813962, lon: 4.388968 }); event.ping(); }, 10000);
