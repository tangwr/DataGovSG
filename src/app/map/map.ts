import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';

import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';

import GeoJSON from 'ol/format/GeoJSON';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})

export class MapComponent implements AfterViewInit {
  map!: Map;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    this.map = new Map({
      target: 'map',

      layers: [
        new TileLayer({
          source: new OSM(),
        }),

        vectorLayer,
      ],

      view: new View({
        center: [11525900, 149000],
        zoom: 12,
      }),
    });

    
    this.http.get('geoJson/HDBExistingBuilding.geojson').subscribe((data) => {
      const features = new GeoJSON().readFeatures(data, {
        featureProjection: 'EPSG:3857',
      });

      vectorSource.addFeatures(features);
    });
    
  }
}
