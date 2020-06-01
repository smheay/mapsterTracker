import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import RulerControl from "mapbox-gl-controls/lib/ruler";
import TooltipControl from "mapbox-gl-controls/lib/tooltip";
/* import InspectControl from "mapbox-gl-controls/lib/inspect"; */

import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-controls/theme.css";

import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
/* import MapboxDraw from "@mapbox/mapbox-gl-draw"; */

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

/* import * as d3 from "d3"; */

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

    /*     var draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true,
      }
    }); 

    // add the draw tool to the map
    map.addControl(draw);  */

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
      </div>
    );
  }
}
