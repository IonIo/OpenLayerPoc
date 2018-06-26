interface StaticSourceOptions {
    html: string;
    url: string;
  }
export interface MapSettings {
    staticSourceOptions?: StaticSourceOptions;
    zoom: number;
    maxZoom: number;
    name: string;
    id: string;
}