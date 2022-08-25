import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

const LAYERstyles = {
  Point: new Style({
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: "magenta",
      }),
    }),
  }),
  Polygon: new Style({
    stroke: new Stroke({
      color: "blue",
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  OneLevel:new Style({
    stroke: new Stroke({
      color: "#101010",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0)",
    }),
  }),
  SecondLevel:new Style({
    stroke: new Stroke({
      color: "#101010",
      width: 2,
    }),
    fill: new Fill({
      color: "yellow",
    }),
  }),
  ThirdLevel:new Style({
    stroke: new Stroke({
      color: "#101010",
      width: 2,
    }),
    fill: new Fill({
      color: "orange",
    }),
  }),
  FourthLevel:new Style({
    stroke: new Stroke({
      color: "#101010",
      width: 2,
    }),
    fill: new Fill({
      color: "red",
    }),
  }),
  
};

export default LAYERstyles;