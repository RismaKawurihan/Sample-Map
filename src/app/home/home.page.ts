import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  selectedBasemap!: string;
  BrinkleyvilleMarker: Graphic | any;

  constructor() { }
  async ngOnInit() {
    const map = new Map({
      basemap: "topo-vector"
    });

    this.mapView = new MapView({
      container: "container",
      map: map,
      zoom: 12,
    });

    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    map.add(weatherServiceFL);

    this.addBrinkleyvilleMarker();


    this.mapView.when(() => {
      const brinkleyvilleCoordinates = [36.2001, -77.6461];
      this.mapView.center = new Point({
        latitude: brinkleyvilleCoordinates[0],
        longitude: brinkleyvilleCoordinates[1]
      });
      this.mapView.zoom = 7;
    });

    await this.updateUserLocationOnMap();
     // this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 1000);
  }

  async getLocationServices(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async changeBasemap() {
    this.mapView.map.basemap = this.selectedBasemap;
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationServices();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    }
    else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }

  addBrinkleyvilleMarker() {
    const brinkleyvilleCoordinates = [36.2001, -77.6461]; // Koordinat Brinkleyville, NC
    const brinkleyvillePoint = new Point({
      latitude: brinkleyvilleCoordinates[0],
      longitude: brinkleyvilleCoordinates[1]
    });

    this.BrinkleyvilleMarker = new Graphic({
      geometry: brinkleyvillePoint,
      symbol: new SimpleMarkerSymbol({
        color: [128, 0, 128],
        size: 8,
        outline: {
          color: [255, 255, 255],
          width: 1
        }
      })
    });

    this.mapView.graphics.add(this.BrinkleyvilleMarker);
  }
}

  const WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer'
