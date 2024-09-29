/* eslint-disable no-unused-vars */
declare namespace naver.maps {
  class Map {
    constructor(element: HTMLElement | string, options: MapOptions);
    setCenter(latlng: LatLng): void;
    setZoom(zoom: number): void;
    panTo(latlng: LatLng): void; // panTo 메서드 추가
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Marker {
    setIcon: any;
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(latlng: LatLng): void;
  }

  interface MapOptions {
    center: LatLng;
    zoom: number;
  }

  interface MarkerOptions {
    position: LatLng;
    map: Map;
    icon?: Icon;
  }

  interface Icon {
    url: string;
    size: Size;
    scaledSize: Size;
    origin: Point;
    anchor: Point;
  }

  class Event {
    static addListener(
      instance: any,
      eventName: string,
      listener: (event: any) => void
    ): void;
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }
}
