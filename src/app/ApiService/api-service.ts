import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ResaleHdbResponse, ResaleHdbChildData, ResaleHdbChildRecord } from '../Interface/interface';
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

}
