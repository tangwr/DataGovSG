import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './ApiService/api-service';
import { ResaleHdbChildData, ResaleHdbChildRecord, ResaleHdbResponse } from './Interface/interface';
import { AllCommunityModule, ModuleRegistry, enableDevValidations } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  PaginationModule,
  PaginationNumberFormatter,
  PaginationNumberFormatterParams,
  PaginationPanel,
} from 'ag-grid-community';
import { firstValueFrom } from 'rxjs';
// Enable extended validations only for development

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AgGridAngular],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('HdbResale');
  private gridApi!: GridApi;

  // Row Data: The data to be displayed.
  /*
  rowData: IRow[] = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
  ];

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<IRow>[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ];
  */

  rowData = signal<ResaleHdbChildRecord[] | null>(null);

  colDefs: ColDef<ResaleHdbChildRecord>[] = [
    { field: '_id', headerName: 'ID' },
    { field: 'month', headerName: 'Month' },
    { field: 'town', headerName: 'Town' },
    { field: 'flat_type', headerName: 'Flat Type' },
    { field: 'block', headerName: 'Block' },
    { field: 'street_name', headerName: 'Street Name' },
    { field: 'storey_range', headerName: 'Storey Range' },
    { field: 'floor_area_sqm', headerName: 'Floor Area (sqm)' },
    { field: 'flat_model', headerName: 'Flat Model' },
    { field: 'lease_commence_date', headerName: 'Lease Commence Date' },
    { field: 'remaining_lease', headerName: 'Remaining Lease' },
    { field: 'resale_price', headerName: 'Resale Price' },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
  };

  paginationPageSize = 10;

  paginationPageSizeSelector: number[] | boolean = [
    10, 20, 30, 40, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
  ];

  paginationPanels: PaginationPanel[] = [
    { type: 'pageSummary', suppressPageInput: true },
    'rowSummary',
    'pageSize',
  ];

  delayMS = 1500;
  combinedRecords = signal<number>(0);

  paginationNumberFormatter: PaginationNumberFormatter = (
    params: PaginationNumberFormatterParams,
  ) => {
    return '[' + params.value.toLocaleString() + ']';
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.gridApi.setGridOption('quickFilterText', value);
  }

  constructor(private apiService: ApiService) {}

  apiResponse = signal<ResaleHdbResponse | null>(null);
  //apiResponse!:ResaleHdbResponse
  apiChildResponse = signal<ResaleHdbChildData | null>(null);
  apiChildResponseArray = signal<ResaleHdbChildData[] | null>(null);
  apiChildResponseRecordArray = signal<ResaleHdbChildRecord[] | null>(null);

  ngOnInit() {
    this.loadHdbResaleData();
  }

  loadHdbResaleData() {
    this.apiService.getHdbResaleData().subscribe((data: ResaleHdbResponse) => {
      this.apiResponse.set(data);
      console.log(data.data.collectionMetadata.childDatasets);
      console.log('apiResponse loaded');
      this.loadHdbResaleChildData();
    });
  }

  private setDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async loadHdbResaleChildData() {
    const response = this.apiResponse();

    if (response && response.data.collectionMetadata.childDatasets.length > 0) {
      for (const datasetId of response.data.collectionMetadata.childDatasets) {
        let offset = 0;

        this.apiService
          .getHdbResaleChildDataSet(datasetId, 1, offset, this.delayMS)
          .subscribe((data: ResaleHdbChildData) => {
            let totalRecords: number = data.result.total;

            console.log('Dataset Id: ' + datasetId + ' | Total: ' + totalRecords);
            this.combinedRecords.update((value) => value + totalRecords);
          });
      }
    }

    const datasetId = 'd_8b84c4ee58e3cfc0ece0d773c8ca6abc';
    let offset = 0;

    this.apiService
      .getHdbResaleChildDataSet(datasetId, 1, offset, this.delayMS)
      .subscribe((data: ResaleHdbChildData) => {
        let totalRecords: number = data.result.total;

        console.log('Dataset Id: ' + datasetId + ' | Total: ' + totalRecords);
        this.loadApi(totalRecords, datasetId);
      });

    this.apiService.getCsvFiles().subscribe((files) => {
      console.log(files);
      for (const csvFile of files) {
        this.apiService.loadCsv(csvFile).subscribe((childRecord: ResaleHdbChildRecord[]) => {
          const records = childRecord;
          console.log(records.length);
          this.rowData.update((currentArray) => [...(currentArray ?? []), ...records]);
        });
      }
    });
    
  }

  async loadApi(totalRecords: number, datasetId: string) {
    let offset = 0;
    const limit = 10000;
    const delay = this.delayMS;

    while (offset < totalRecords) {
      await this.setDelay(delay);
      console.log('Dataset Id: ' + datasetId + ' | offset: ' + offset);

      setTimeout(() => {
        this.apiService
          .getHdbResaleChildDataSet(datasetId, limit, offset, this.delayMS)
          .subscribe((childData: ResaleHdbChildData) => {
            const records = childData.result.records;
            console.log(records.length);
            this.apiChildResponseRecordArray.update((currentArray) => [
              ...(currentArray ?? []),
              ...records,
            ]);
            this.rowData.update((currentArray) => [...(currentArray ?? []), ...records]);
          });

        offset += limit;
      }, delay);
    }
  }
}
