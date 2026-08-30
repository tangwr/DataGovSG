import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';

import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';

import GeoJSON from 'ol/format/GeoJSON';

import { fromLonLat, transformExtent } from 'ol/proj';

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

    const singaporeExtent = transformExtent([103.6, 1.15, 104.1, 1.5], 'EPSG:4326', 'EPSG:3857');

    this.map = new Map({
      target: 'map',

      layers: [
        new TileLayer({
          source: new OSM(),
        }),

        vectorLayer,
      ],

      view: new View({
        center: fromLonLat([103.8198, 1.3521]),
        zoom: 11,
        extent: singaporeExtent,
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
