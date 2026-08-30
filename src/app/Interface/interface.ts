export interface ResaleHdbResponse {
  code: number;
  data: ResaleData;
  errorMsg: string;
}

export interface ResaleData {
  collectionMetadata: ResaleCollectionMetadata;
}

export interface ResaleCollectionMetadata {
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

export interface ResaleHdbChildData {
  success: boolean;
  result: ResaleHdbChildResult;
}

export interface ResaleHdbChildResult {
  resource_id: string;
  fields: ResaleHdbChildField[];
  records: ResaleHdbChildRecord[];
  _links: ResaleHdbChildLinks;
  total: number;
  limit: number;
  offset: number;
}

export interface ResaleHdbChildField {
  type: string;
  id: string;
}

export interface ResaleHdbChildRecord {
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

export interface ResaleHdbChildLinks {
  start: string;
  next: string;
}

export interface ResaleHdbDataRow extends ResaleHdbChildRecord {}

export interface HdbExistingBuildingInterface {
  code: number;
  data: {
    url: string;
  };
  errorMsg: string;
}
