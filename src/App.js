import React, { useState, useEffect } from "react";
import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";

import { vector,xyz, cluster } from "./Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";

import { Controls, FullScreenControl } from "./Controls";
import LAYERstyles from "./Features/Styles";

import mapConfig from "./config.json";
import "./App.css";
import axios from 'axios';

import {ContainerFlex} from './styles/ContainerMain.styled'
import SideMenuWrapper from "./SideMenuWrapper/SideMenuWrapper";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";


const App = () => {
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(mapConfig.zoom);
  const [showLayer1, setShowLayer1] = useState(true);
  const [loading, setLoading] = useState(true);
  const [clusterDistance, setClusterDistance] = useState(50);
  const [minClusterDistance, setMinClusterDistance] = useState(50);
  const [styleCache, setStyleCache] = useState({});

  const [virtualStations, setVirtualStations] = useState(
    {
      "type": "FeatureCollection",
      "crs": {
          "type": "name",
          "properties": {
              "name": "EPSG:4326"
          }
      },
      "features": []
    }
  );
  const [opacityLayer, SetOpacityLayer]= useState(1);

  const changeStyle = (date) =>{
    setShowLayer1(false)
  }

  const onOffLayer = (event) =>{
    setShowLayer1(event.target.checked)
  }

const getStyle = (feature) => {
    // console.log(feature)
    const river_index = feature.get('river_name');
    // const lake_river = feature.get('lake_name');
    if(river_index){
      // console.log(river_index)
      return LAYERstyles.River
    }
    else{
      // console.log(lake_river)
      return LAYERstyles.Lake
    }

    // if(floodindex === 2){
    //   return FeatureStyles.SecondLevel
    // }
    // if(floodindex === 3){
    //   return FeatureStyles.ThirdLevel
    // }
    // if(floodindex === 4){
    //   return FeatureStyles.FourthLevel
    // }
    
  }
  // Adding the geojson layer to the map with stations
  useEffect(() => {

    const service_link = 'http://127.0.0.1:8000/apps/hydroweb/getVirtualStations/';
    const fetchStations = async () =>{
      try {
          const {data: response} = await axios.post(service_link);

          console.log("useEffect app.js 1");
          console.log(response)
          setVirtualStations(response)
          setLoading(false);
          setShowLayer1(true)

      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    }
    fetchStations();

	}, [clusterDistance]);
  

  return (
    <div>
      {loading && <div>Loading</div>}
      {!loading && (
      <ContainerFlex>
        <SideMenuWrapper 
          style = {changeStyle}
          onLayer = { onOffLayer}
          layer = {showLayer1}
          opacity_wms = {SetOpacityLayer}
          wms_op_val = {opacityLayer}
        />

        <Map center={fromLonLat(center)} zoom={zoom}>
          <Layers>
            <TileLayer 
              layerClass={"base_layer"}
            
              source={xyz(
                {
                  attributions:
                  'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                  'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
                  url:
                  'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                  'World_Imagery/MapServer/tile/{z}/{y}/{x}',
                }
            )} zIndex={0} />

            {showLayer1 && (
                <VectorLayer
                source={
                    cluster(
                      {
                        distance: clusterDistance,
                        minDistance: minClusterDistance,
                        source: vector(
                          {
                            features: new GeoJSON().readFeatures(virtualStations, {
                              featureProjection: get("EPSG:3857"),
                            }),
                        })
                      }
                    )
                }
                // style={function(feature){
                //   return getStyle(feature)
                // }}
                style={
                  function (feature) {
                    let style;
                    const size = feature.get('features').length;
                    console.log(size)
                    console.log(feature.get("features"))

                    if(size < 2){
                      feature.get("features").forEach(function(feature) {
                        var river_index = feature.get("river_name");
                        console.log(river_index)
                        if (river_index) {
                          style = new Style({
                            image: new CircleStyle({
                              radius: 10,
                              stroke: new Stroke({
                                color: '#1C07F1',
                              }),
                              fill: new Fill({
                                color: '#1C07F1',
                              }),
                            }),
                            text: new Text({
                              text: `River ${feature.get('river_name')}`,
                              // fill: new Fill({
                              //   color: '#fff',
                              // }),
                              font: 'bold 12px "Open Sans" ',
                              placement: 'point',
                              fill: new Fill({color: '#fff'}),
                              stroke: new Stroke({color: '#000', width: 1}),

                            }),
                          });
                        }
                        else {
                          style = new Style({
                            image: new CircleStyle({
                              radius: 10,
                              stroke: new Stroke({
                                color: '#0F4248',
                              }),
                              fill: new Fill({
                                color: '#0F4248',
                              }),
                            }),
                            text: new Text({
                              text: `Lake ${feature.get('lake_name')}`,
                              font: 'bold 12px "Open Sans" ',
                              placement: 'point',
                              fill: new Fill({color: '#fff'}),

                              stroke: new Stroke({color: '#000', width: 1}),
                              // text: size.toString(),
                              // fill: new Fill({
                              //   color: '#fff',
                              // }),
                            }),
                          });
                        }
                      });
                    }

                    else{
                      style = styleCache[size];
                      if (!style) {
                        style = new Style({
                          image: new CircleStyle({
                            radius: 10,
                            stroke: new Stroke({
                              color: '#fff',
                            }),
                            fill: new Fill({
                              color: '#3399CC',
                            }),
                          }),
                          text: new Text({
                            text: size.toString(),
                            fill: new Fill({
                              color: '#fff',
                            }),
                          }),
                        });
                        
                        // styleCache[size] = style;
                        setStyleCache(styleCache => ({...styleCache, size: style}))
  
                      }
                    }

                    return style;
                  }
                }
                zIndex={2}

              />
            )}

          </Layers>
          <Controls>
            <FullScreenControl />
          </Controls>
        </Map>


      </ContainerFlex>
    )}

    </div>
  );
};

export default App;