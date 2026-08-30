export interface ResaleHdbResponseInterface {
  code: number;
  data: ResaleDataInterface;
  errorMsg: string;
}

export interface ResaleDataInterface {
  collectionMetadata: ResaleCollectionMetadataInterface;
}

export interface ResaleCollectionMetadataInterface {
  collectionId: string;
  createdAt: string;
  name: string;
  description: string;
  lastUpdatedAt: string;
  coverageStart: string;
  coverageEnd: string;
  frequency: string;
  sources: string[];
  managedBy: string;
  childDatasets: string[];
}

export interface ResaleHdbChildDataInterface {
  success: boolean;
  result: ResaleHdbChildResultInterface;
}

export interface ResaleHdbChildResultInterface {
  resource_id: string;
  fields: ResaleHdbChildFieldInterface[];
  records: ResaleHdbChildRecordInterface[];
  _links: LinksInteface;
  total: number;
  limit: number;
  offset: number;
}

export interface ResaleHdbChildFieldInterface {
  type: string;
  id: string;
}

export interface ResaleHdbChildRecordInterface {
  _id: number;
  month: string;
  town: string;
  flat_type: string;
  block: string;
  street_name: string;
  storey_range: string;
  floor_area_sqm: string;
  flat_model: string;
  lease_commence_date: string;
  remaining_lease: string;
  resale_price: string;
}

export interface LinksInteface {
  start: string;
  next: string;
}

export interface ResaleHdbDataRowInterface extends ResaleHdbChildRecordInterface {}

export interface HdbExistingBuildingInterface {
  code: number;
  data: {
    url: string;
  };
  errorMsg: string;
}

export interface HdbPropertyInformationInterface {
  success: boolean;
  result: {
    resource_id: string;
    fields: HdbPropertyInformationFieldInterface[];
    records: HdbPropertyInformationRecordInterface[];
    _links: LinksInteface;
    total: number;
  };
}

export interface HdbPropertyInformationFieldInterface {
  type: string;
  id: string;
}

export interface HdbPropertyInformationRecordInterface {
  _id: number;
  blk_no: string;
  street: string;
  max_floor_lvl: string;
  year_completed: string;
  residential: string;
  commercial: string;
  market_hawker: string;
  miscellaneous: string;
  multistorey_carpark: string;
  precinct_pavilion: string;
  bldg_contract_town: string;
  total_dwelling_units: string;
  '1room_sold': string;
  '2room_sold': string;
  '3room_sold': string;
  '4room_sold': string;
  '5room_sold': string;
  exec_sold: string;
  multigen_sold: string;
  studio_apartment_sold: string;
  '1room_rental': string;
  '2room_rental': string;
  '3room_rental': string;
  other_room_rental: string;
}
