import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './ApiService/api-service';
import {
  HdbPropertyInformationInterface,
  HdbPropertyInformationRecordInterface,
  ResaleHdbChildDataInterface,
  ResaleHdbChildRecordInterface,
  ResaleHdbResponseInterface,
} from './Interface/interface';
import { AllCommunityModule, ModuleRegistry, enableDevValidations } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  GridOptions,
  PaginationModule,
  PaginationNumberFormatter,
  PaginationNumberFormatterParams,
  PaginationPanel,
} from 'ag-grid-community';
import { firstValueFrom, toArray } from 'rxjs';
import { MapComponent } from './map/map';
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
  imports: [RouterOutlet, AgGridAngular, MapComponent],
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

  rowData = signal<ResaleHdbChildRecordInterface[] | null>(null);

  colDefs: ColDef<ResaleHdbChildRecordInterface>[] = [
    //{ field: '_id', headerName: 'ID' },
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

  rowHdbPropertyInfoData = signal<HdbPropertyInformationRecordInterface[] | null>(null);

  colDefHdbPropertyInfoData: ColDef<HdbPropertyInformationRecordInterface>[] = [
    //{ field: '_id', headerName: 'ID' },
    { field: 'blk_no', headerName: 'Blk No' },
    { field: 'street', headerName: 'Street' },
    { field: 'max_floor_lvl', headerName: 'Max Floor Lvl' },
    { field: 'year_completed', headerName: 'Year Completed' },
    { field: 'residential', headerName: 'Residential' },
    { field: 'commercial', headerName: 'Commercial' },
    { field: 'market_hawker', headerName: 'Market Hawker' },
    { field: 'miscellaneous', headerName: 'Miscellaneous' },
    { field: 'multistorey_carpark', headerName: 'Multistorey Carpark' },
    { field: 'precinct_pavilion', headerName: 'Precinct Pavilion' },
    { field: 'bldg_contract_town', headerName: 'Bldg Contract Town' },
    { field: 'total_dwelling_units', headerName: 'Total Dwelling Units' },
    { field: '1room_sold', headerName: '1 Room Sold' },
    { field: '2room_sold', headerName: '2 Room Sold' },
    { field: '3room_sold', headerName: '3 Room Sold' },
    { field: '4room_sold', headerName: '4 Room Sold' },
    { field: '5room_sold', headerName: '5 Room Sold' },
    { field: 'exec_sold', headerName: 'Exec Sold' },
    { field: 'multigen_sold', headerName: 'Multigen Sold' },
    { field: 'studio_apartment_sold', headerName: 'Studio Apartment Sold' },
    { field: '1room_rental', headerName: '1 Room Rental' },
    { field: '2room_rental', headerName: '2 Room Rental' },
    { field: '3room_rental', headerName: '3 Room Rental' },
    { field: 'other_room_rental', headerName: 'Other Room Rental' },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
  };

  paginationPageSize = 100;

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
  totalHdbPropertyInfo = signal<number>(0);

  paginationNumberFormatter: PaginationNumberFormatter = (
    params: PaginationNumberFormatterParams,
  ) => {
    return '[' + params.value.toLocaleString() + ']';
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onGridReadyAutoSize(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.autoSizeAllColumns();
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.gridApi.setGridOption('quickFilterText', value);
  }

  constructor(private apiService: ApiService) {}

  apiResponse = signal<ResaleHdbResponseInterface | null>(null);
  //apiResponse!:ResaleHdbResponse
  apiChildResponse = signal<ResaleHdbChildDataInterface | null>(null);
  apiChildResponseArray = signal<ResaleHdbChildDataInterface[] | null>(null);
  apiChildResponseRecordArray = signal<ResaleHdbChildRecordInterface[] | null>(null);
  apiChildResponseRecordDatasetId = signal<string | null>(null);

  ngOnInit() {
    this.loadHdbResaleData();
    this.loadHdbPropertyInfo();
  }

  loadHdbResaleData() {
    this.apiService.getHdbResaleData().subscribe((data: ResaleHdbResponseInterface) => {
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
          .subscribe((data: ResaleHdbChildDataInterface) => {
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
      .subscribe((data: ResaleHdbChildDataInterface) => {
        let totalRecords: number = data.result.total;

        console.log('Dataset Id: ' + datasetId + ' | Total: ' + totalRecords);
        this.loadApi(totalRecords, datasetId);
      });

    this.apiService.getCsvFiles().subscribe((files) => {
      console.log(files);
      for (const csvFile of files) {
        this.apiService
          .loadCsv(csvFile)
          .subscribe((childRecord: ResaleHdbChildRecordInterface[]) => {
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
          .subscribe((childData: ResaleHdbChildDataInterface) => {
            const records = childData.result.records;
            console.log(records.length);
            this.apiChildResponseRecordDatasetId.set(childData.result.resource_id);
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

  async loadHdbPropertyInfo() {
    let offset = 0;
    
    const limit = 5000;
    const delay = this.delayMS;
    const dataset_id = 'd_17f5382f26140b1fdae0ba2ef6239d2f';

    const records = await firstValueFrom(
      this.apiService.getHdbPropertyInformation(limit, offset, delay)
    );

    let totalRecords = records.result.total;
    this.totalHdbPropertyInfo.set(totalRecords);

    while (offset < totalRecords) {
      await this.setDelay(delay);
      console.log('loadHdbPropertyInfo() | Dataset Id: ' + dataset_id + ' | offset: ' + offset + ' | totalRecords: ' + totalRecords);

      setTimeout(() => {
        this.apiService
          .getHdbPropertyInformation(limit, offset, delay)
          .subscribe((records: HdbPropertyInformationInterface) => {
            console.log(records);
            this.rowHdbPropertyInfoData.update((currentArray) => [
              ...(currentArray ?? []),
              ...records.result.records,
            ]);
          });
          
          offset += limit;
      }, delay);

      setTimeout(() => {
        this.gridApi.autoSizeAllColumns();
      });
    }
  }
}
