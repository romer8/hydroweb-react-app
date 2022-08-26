import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";

const LAYERstyles = {
  // RiverCluster: new Style({
  //   image: new CircleStyle({
  //     radius: 10,
  //     stroke: new Stroke({
  //       color: '#fff',
  //     }),
  //     fill: new Fill({
  //       color: '#3399CC',
  //     }),
  //   }),
  //   text: new Text({
  //     text: size.toString(),
  //     fill: new Fill({
  //       color: '#fff',
  //     }),
  //   }),
  // }),



  River: new Style({
    image: new CircleStyle({
      radius: 2.5,
      fill: new Fill({
        color: "#1C07F1",
      }),
      stroke: new Stroke({
        color: "#1C07F1",
      }),
    }),
  }),
  Lake: new Style({
    image: new CircleStyle({
      radius: 5,
      fill: null,
      stroke: new Stroke({
        color: "#07D8F1",
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