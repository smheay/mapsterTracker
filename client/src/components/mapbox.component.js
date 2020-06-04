import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import RulerControl from "mapbox-gl-controls/lib/ruler";
import TooltipControl from "mapbox-gl-controls/lib/tooltip";
/* import InspectControl from "mapbox-gl-controls/lib/inspect"; */

import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-controls/theme.css";

/* import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions"; */
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default class Mapbox extends Component {
  mapRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      lng: -122.6863,
      lat: 45.5085,
      zoom: 1.5,
    };
  }

  componentDidMount() {
    /*  const { lng, lat, zoom } = this.state; */

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [-122.6863, 45.5085],
      zoom: 16,
      preserveDrawingBuffer: true,
    });

    /*    var directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      controls: {
        instructions: false,
      },
      unit: "metric",
      profile: "mapbox/walking",
    });
    map.addControl(directions, "top-left"); */
    var draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true,
      },
      styles: [
        // ACTIVE (being drawn)
        // line stroke
        {
          id: "gl-draw-line",
          type: "line",
          filter: [
            "all",
            ["==", "$type", "LineString"],
            ["!=", "mode", "static"],
          ],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#3b9ddd",
            "line-dasharray": [0.2, 2],
            "line-width": 4,
            "line-opacity": 0.7,
          },
        },
        // vertex point halos
        {
          id: "gl-draw-polygon-and-line-vertex-halo-active",
          type: "circle",
          filter: [
            "all",
            ["==", "meta", "vertex"],
            ["==", "$type", "Point"],
            ["!=", "mode", "static"],
          ],
          paint: {
            "circle-radius": 10,
            "circle-color": "#FFF",
          },
        },
        // vertex points
        {
          id: "gl-draw-polygon-and-line-vertex-active",
          type: "circle",
          filter: [
            "all",
            ["==", "meta", "vertex"],
            ["==", "$type", "Point"],
            ["!=", "mode", "static"],
          ],
          paint: {
            "circle-radius": 6,
            "circle-color": "#3b9ddd",
          },
        },
      ],
    });

    // use the coordinates you just drew to make your directions request
    function updateRoute() {
      removeRoute(); // overwrite any existing layers
      var data = draw.getAll();
      var answer = document.getElementById("directions");
      var lastFeature = data.features.length - 1;
      var coords = data.features[lastFeature].geometry.coordinates;
      var newCoords = coords.join(";");
      getMatch(newCoords);
    }
    // make a directions request
    function getMatch(e) {
      // https://www.mapbox.com/api-documentation/#directions
      var url =
        "https://api.mapbox.com/directions/v5/mapbox/walking/" +
        e +
        "?geometries=geojson&steps=true&&access_token=" +
        mapboxgl.accessToken;
      var req = new XMLHttpRequest();
      req.responseType = "json";
      req.open("GET", url, true);
      req.onload = function () {
        var jsonResponse = req.response;
        var distance = jsonResponse.routes[0].distance  * 0.00062137; // convert to miles
        /* var duration = (jsonResponse.routes[0].duration / 60 ) ; // convert to sec at 8mph pace */
        // add results to info box
        var coords = jsonResponse.routes[0].geometry;
        document.getElementById("directions").innerHTML =
          "Distance: " +
          distance.toFixed(2) +
          " miles "
        // add the route to the map
        addRoute(coords);
      };
      req.send();
    }
    // adds the route as a layer on the map
    function addRoute(coords) {
      // check if the route is already loaded
      if (map.getSource("route")) {
        map.removeLayer("route");
        map.removeSource("route");
      } else {
        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: coords,
            },
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3b9ddd",
            "line-width": 8,
            "line-opacity": 0.8,
          },
        });
      }
    }
    // remove the layer if it exists
    function removeRoute() {
      if (map.getSource("route")) {
        map.removeLayer("route");
        map.removeSource("route");
        document.getElementById("directions").innerHTML = "";
      } else {
        return;
      }
    }

    // add create, update, or delete actions
    map.on("draw.create", updateRoute);
    map.on("draw.update", updateRoute);
    map.on("draw.delete", removeRoute);

    // add the draw tool to the map
    map.addControl(draw);

    // ruler with with miles:
    var ruler = new RulerControl({
      units: "miles",
      labelFormat: (n) => `${n.toFixed(2)} ml`,
    });
    map.addControl(ruler, "top-right");

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    map.addControl(new TooltipControl({ layer: "$fill" }));

    /*    map.on('load', () => console.log(map.getCanvas().toDataURL())); */ //save map image
    /*map.addControl(new InspectControl(), "bottom-right"); */ //MAP INFO CONTROL

    /*     map.on("load", function () {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [-122.68369693756104, 45.50381888486939],
              [-122.68348236083984, 45.50317489144141],
              [-122.68339653015138, 45.50270036637107],
              [-122.68356819152832, 45.502056363179625],
              [-122.68404026031496, 45.50114119107971],
              [-122.68404026031496, 45.50049717427869],
              [-122.68348236083984, 45.509920943955045],
              [-122.68356819152832, 45.50954808664175],
              [-122.68507022857666, 45.50944639795659],
              [-122.68610019683838, 45.50880236636284],
              [-122.68695850372314, 45.50931081282506],
              [-122.68700141906738, 45.50080223556934],
              [-122.68751640319824, 45.50168351665737],
              [-122.68803138732912, 45.502158048267786],
              [-122.68888969421387, 45.50297152392784],
              [-122.68987674713133, 45.50263257682617],
              [-122.68043464660643, 45.502937629287755],
              [-122.68125003814696, 45.502429207817725],
              [-122.68163627624512, 45.502564787218985],
              [-122.68223709106445, 45.50337825839438],
              [-122.68378204345702, 45.50368330777276],
            ],
          },
        },
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 4,
        },
      });
    });  */
  }
  /* https://docs.mapbox.com/help/tutorials/get-started-map-matching-api/ https://codepen.io/gislayer/pen/KBwMKd?editors=0010 other ideas */
  render() {
    return (
      <div className="mapContainer2 bg-dark">
        <div className="sidebarStyle">
          <div>
            Longitude: {this.state.lng} | Latitude: {this.state.lat}
          </div>
        </div>

        <div ref={(el) => (this.mapContainer = el)} className="mapContainer" />
        <div className="info-box">
          <div id="info"></div>
          <div id="directions"></div>
        </div>
      </div>
    );
  }
}
