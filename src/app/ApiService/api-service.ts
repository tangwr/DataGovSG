import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ResaleHdbResponseInterface,
  ResaleHdbChildDataInterface,
  ResaleHdbChildRecordInterface,
  HdbExistingBuildingInterface,
  HdbPropertyInformationInterface,
} from '../Interface/interface';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Papa from 'papaparse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  //url = '/api/action/datastore_search';

  constructor(private httpClient: HttpClient) {}

  private headers = new HttpHeaders({
    'x-api-key': environment.apiKey,
  });

  getHdbResaleData(): Observable<ResaleHdbResponseInterface> {
    const collection_id = 189;
    const url = 'https://api-production.data.gov.sg/v2/public/api/collections/{}/metadata';
    return this.httpClient.get<ResaleHdbResponseInterface>(url.replace('{}', collection_id.toString()));

  }

  getHdbResaleChildDataSet(
    dataset_id: string,
    limit: number,
    offset: number,
    delay: number,
  ): Observable<ResaleHdbChildDataInterface> {

    /*
    const headers = new HttpHeaders({
      'x-api-key': environment.apiKey,
    });
    */

    let url =
      'https://data.gov.sg/api/action/datastore_search?resource_id=' +
      dataset_id +
      '&limit=' +
      limit +
      '&offset=' +
      offset;
    console.log(url);
    return timer(delay).pipe(
      switchMap(() => this.httpClient.get<ResaleHdbChildDataInterface>(url, { headers: this.headers })),
    );
  }

  loadCsv(csvFile: string): Observable<ResaleHdbChildRecordInterface[]> {

    const filePath = 'csv/' + csvFile;
    return this.httpClient
      .get(filePath, {
        responseType: 'text' as const,
      })
      .pipe(
        map((csv) => {
          const result = Papa.parse<ResaleHdbChildRecordInterface>(csv, {

            header: true,
            skipEmptyLines: true,
          });
          console.log('csvFile: ' + csvFile + ' | Records: ' + result.data.length);
          return result.data;
        }),
      );
  }

  getCsvFiles(): Observable<string[]> {
    return this.httpClient.get<string[]>('csv/csvFiles.json');
  }

  getHdbExistingBuilding() {
    const url =
      'https://api-open.data.gov.sg/v1/public/api/datasets/d_16b157c52ed637edd6ba1232e026258d/poll-download';
  }

  getHdbGeoJson(): Observable<any> {
    const apiUrl =
      'https://api-open.data.gov.sg/v1/public/api/datasets/d_16b157c52ed637edd6ba1232e026258d/poll-download';

    return this.httpClient.get<HdbExistingBuildingInterface>(apiUrl).pipe(
      switchMap((response) => {
        return this.httpClient.get(response.data.url, { headers: this.headers });
      }),
    );
  }

  getHdbPropertyInformation(): Observable<HdbPropertyInformationInterface> {
    const dataset_id = 'd_17f5382f26140b1fdae0ba2ef6239d2f';
    const url = 'https://data.gov.sg/api/action/datastore_search?resource_id=' + dataset_id;
    return this.httpClient.get<HdbPropertyInformationInterface>(url);
  }
}
