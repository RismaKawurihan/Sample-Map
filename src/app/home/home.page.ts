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
  AshlandMarker: Graphic | any;

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

    this.addAshlandMarker();


    this.mapView.when(() => {
      const ashlandCoordinates = [40.86833639733679, -82.31767291043275];
      this.mapView.center = new Point({
        latitude: ashlandCoordinates[0],
        longitude: ashlandCoordinates[1]
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

  addAshlandMarker() { // Ubah method ini
    const ashlandCoordinates = [40.86833639733679, -82.31767291043275];
    const ashlandPoint = new Point({
      latitude: ashlandCoordinates[0],
      longitude: ashlandCoordinates[1]
    });

    this.AshlandMarker = new Graphic({
      geometry: ashlandPoint,
      symbol: new SimpleMarkerSymbol({
        color: [128, 0, 128],
        size: 8,
        outline: {
          color: [255, 255, 255],
          width: 1
        }
      })
    });

    this.mapView.graphics.add(this.AshlandMarker);
  }
}
  const WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer'
