export interface Station {
  "@id": string;
  label?: string;
  catchmentName?: string;
}

export interface Reading {
  "@id": string;
  dateTime: string;
  measure: string;
  value: number;
}

export interface ReadingsResponse {
  items: Reading[];
}
