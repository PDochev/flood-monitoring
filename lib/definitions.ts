export interface Station {
  "@id": string;
  label?: string;
  catchmentName?: string;
}

export interface StationSelectorProps {
  stations: Station[];
  onStationSelect: (stationId: string | null) => void;
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

export interface StationChartProps {
  stationId: string | null;
}

export interface ChartData {
  dateTime: string;
  time: string;
  stage?: number;
  downstream?: number;
}

export interface RenderChartProps {
  chartData: ChartData[];
  hasStageData: boolean;
  hasDownstreamData: boolean;
}

export interface TableDataProps {
  tableData: ChartData[];
  hasStageData: boolean;
  hasDownstreamData: boolean;
}

export type ViewMode = "chart" | "table";
