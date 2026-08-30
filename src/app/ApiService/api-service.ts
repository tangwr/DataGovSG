import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ResaleHdbResponse, ResaleHdbChildData, ResaleHdbChildRecord, HdbExistingBuildingInterface } from '../Interface/interface';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Papa from 'papaparse';
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  //url = '/api/action/datastore_search';

  constructor(private httpClient: HttpClient) {}
  

  getHdbResaleData():Observable<ResaleHdbResponse> {
    const collection_id = 189          
    const url = "https://api-production.data.gov.sg/v2/public/api/collections/{}/metadata"
    return this.httpClient.get<ResaleHdbResponse>(url.replace("{}", collection_id.toString()));
  }

  getHdbResaleChildDataSet(dataset_id: string, limit: number, offset: number, delay: number):Observable<ResaleHdbChildData> {
    const headers = new HttpHeaders({
      'x-api-key': environment.apiKey
    });

    let url = "https://data.gov.sg/api/action/datastore_search?resource_id="  + dataset_id + "&limit=" + limit + "&offset=" + offset
    console.log(url);
    return timer(delay).pipe(
      switchMap(() => this.httpClient.get<ResaleHdbChildData>(url, { headers }))
    );
  }

  loadCsv(csvFile: string):Observable<ResaleHdbChildRecord[]>{
    const filePath = "csv/" + csvFile;
    return this.httpClient.get(filePath, {
      responseType: 'text' as const
    }).pipe(
      map(csv => {
        const result = Papa.parse<ResaleHdbChildRecord>(csv, {
          header: true,
          skipEmptyLines: true
        });
        console.log("csvFile: " + csvFile + " | Records: " + result.data.length);
        return result.data;
      })
    );
  }

  getCsvFiles(): Observable<string[]> {
    return this.httpClient.get<string[]>('csv/csvFiles.json');
  }

  getHdbExistingBuilding(){
    const url = "https://api-open.data.gov.sg/v1/public/api/datasets/d_16b157c52ed637edd6ba1232e026258d/poll-download";

  }

  getHdbGeoJson(): Observable<any> {
    const apiUrl =
    'https://api-open.data.gov.sg/v1/public/api/datasets/d_16b157c52ed637edd6ba1232e026258d/poll-download';

    return this.httpClient
      .get<HdbExistingBuildingInterface>(apiUrl)
      .pipe(
        switchMap(response => {
          return this.httpClient.get(response.data.url);
        })
      );
  }

}
