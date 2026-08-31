import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HdbResale } from './hdb-resale/hdb-resale'
import { MapComponent } from './map/map';
// Enable extended validations only for development


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HdbResale, MapComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App  {
  
}
