import React, { useState, useEffect } from "react";
import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";

import { vector,xyz } from "./Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import TileWMS from 'ol/source/TileWMS';

import { Controls, FullScreenControl } from "./Controls";
import FeatureStyles from "./Features/Styles";

import mapConfig from "./config.json";
import "./App.css";
import axios from 'axios';

import {ContainerFlex} from './styles/ContainerMain.styled'
import SideMenuWrapper from "./SideMenuWrapper/SideMenuWrapper";


const App = () => {
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(mapConfig.zoom);
  const [showLayer1, setShowLayer1] = useState(true);
  const [loading, setLoading] = useState(true);
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
    const river_index = feature.get('river_name');
    const lake_river = feature.get('river_name');


    if(floodindex === 2){
      return FeatureStyles.SecondLevel
    }
    if(floodindex === 3){
      return FeatureStyles.ThirdLevel
    }
    if(floodindex === 4){
      return FeatureStyles.FourthLevel
    }
    
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

	}, []);
  

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
                source={vector({
                  features: new GeoJSON().readFeatures(virtualStations, {
                    featureProjection: get("EPSG:4326"),
                  }),
                })}
                style={function(feature){
                  return getStyle(feature)
                }}
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