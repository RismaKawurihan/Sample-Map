import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() {}
  private latitude: number | any;
  private longtitude: number| any;

  public async ngOnInit() {
    // this.latitude = 110.39822652665721;
    // this.latitude= -7.80301783078655;
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longtitude = position.coords.longitude;
   const map = new Map({
    basemap: "topo-vector"
   });

   const view = new MapView({
    container: "container",
    map: map,
    zoom: 12,
    center: [this.longtitude, this.latitude]
   })

  // Buat simbol marker
  const markerSymbol = new SimpleMarkerSymbol({
    color: [226, 119, 40], // Warna marker
    outline: {
      color: [255, 255, 255], // Warna outline
      width: 2
    }
  });

  // Buat point berdasarkan latitude dan longitude
  const point = new Point({
    longitude: this.longtitude,
    latitude: this.latitude
  });

  // Buat graphic untuk marker
  const pointGraphic = new Graphic({
    geometry: point,
    symbol: markerSymbol
  });

  // Tambahkan marker ke peta
  view.graphics.add(pointGraphic);
}

}
