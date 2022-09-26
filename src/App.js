import React, { useState, useEffect, useRef } from "react";
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
import { SplitContainer } from "./styles/SplitContainer.styled";
import LowerMenuWrapper from "./Menu/LowerMenu";
import JobsMenu from "./Menu/LowerMenu";
import Loader_wrapper from "./Extra/Loader_wrapper";

import { WebSocketWrapper } from "./WebsocketWrapper";
import {ErrorBoundary} from 'react-error-boundary'

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const App = () => {
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(mapConfig.zoom);
  const [showLayer1, setShowLayer1] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clusterDistance, setClusterDistance] = useState(50);
  const [minClusterDistance, setMinClusterDistance] = useState(50);
  const [styleCache, setStyleCache] = useState({});
  const [selectedFeature, setSelectedFeature] = useState("");
  const [selectedGeoglows, setSelectedGeoglows] = useState("")
  const [dataStation, setDataStation] = useState([]);
  const [minDataStation, setMinDataStation] = useState([]);
  const [maxDataStation, setMaxDataStation] = useState([]);
  const [dataGeoglows, setDataGeoglows] = useState({});
  const [listGeoglowsApiCalls, setListGeoglowsApiCalls] = useState([]);
  const [isFullMap, setIsFullMap] = useState(true)
  const [isGeoglowsActive, setIsGeoglowsActive] = useState(false)
  const [dataObject,setDataObject] = useState([]);
  const [isBiasCorrectionOn, setBiasCorrectionOn] = useState(false);
  const socketRef = useRef();
  const [isError, setIsError] = React.useState(false)

  var ws = 'ws://' + 'localhost:8000/hydroweb' + '/data-notification/notifications/ws/';


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

  const onclickFeature = (e) => {
    console.log(e)
  }

  const executeGeoglows = () => {
    setIsGeoglowsActive(!isGeoglowsActive);
    console.log(isGeoglowsActive);
    var new_job = `${selectedFeature}-->${selectedGeoglows}`;
    console.log(new_job)
    var found = listGeoglowsApiCalls.some(p => p == new_job)
    console.log(found)
    if(!found){
      setListGeoglowsApiCalls(listGeoglowsApiCalls => [...listGeoglowsApiCalls, new_job]);
    }

    console.log(listGeoglowsApiCalls)
  };

  const executeBiasCorrection = () => {
    console.log(isBiasCorrectionOn);
    var new_job = `${selectedFeature}-->${selectedGeoglows}`;
    console.log(new_job)
    var found = listGeoglowsApiCalls.some(p => p == new_job)
    console.log(found)
    if(found){
      setBiasCorrectionOn(!isBiasCorrectionOn);
    }
  };
  
const getStyle = (feature) => {
    const river_index = feature.get('river_name');
    if(river_index){
      return LAYERstyles.River
    }
    else{
      return LAYERstyles.Lake
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
          setShowLayer1(true);

      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    }
    fetchStations();
    // socketRef.current = new WebSocketWrapper();
    // socketRef.current.startWS(ws);
    socketRef.current = new WebSocket(ws);
      socketRef.current.onopen = () => {
        console.log("WebSocket is Open");
      };
  
      socketRef.current.onmessage = function (e) {
        let data = JSON.parse(e.data);
        let reach_id2 = data['reach_id'];
        let product2 = data['product'];
        let command = data['command'];
        console.log(data);
        if (command == "Data_Downloaded"){
          socketRef.current.send(
            JSON.stringify({
              type: "plot_hs_data",
              reach_id:reach_id2,
              product: product2
  
            })
          );
        }
        if (command == "Plot_Data"){
          let dataHistorical = JSON.parse(data['data']);
          const dataHistoricalObject = {
            stroke:"#00008B",
            dataKey:"Historical Simulation",
            data:dataHistorical
          }
          console.log(dataHistoricalObject)

          setDataGeoglows(dataHistorical);
          setDataObject(dataObject => [...dataObject,dataHistoricalObject ]);
        }
        
        

      };
  
      socketRef.current.onclose = function () {
        // Try to reconnect in 1 second
        setTimeout(function () {
          //implement more logic
          // this.startWS(websocketServerLocation);
        }, 1000);
        console.log("WebSocket is Closed");
      };
    

	}, []);
  
  useEffect(() => {
    setLoading(true);

    const Mydata = {
      'product': selectedFeature
    }
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    console.log(Mydata);
    const service_link = 'http://127.0.0.1:8000/apps/hydroweb/getVirtualStationData/';
    const fetchData= async () =>{
      try {
          const {data: response} = await axios.post(service_link,Mydata,config);
          // const newArrayMax = array.map(({dropAttr1, dropAttr2, ...keepAttrs}) => keepAttrs)

          // const {data: response} = await axios.post(service_link);
          // console.log(response)
          // setDataStation(response['data'])
          setDataStation(response['data']['val'])
          setMinDataStation(response['data']['min'])
          setMaxDataStation(response['data']['max'])
          const normal_data = {
            stroke:"#2B4865",
            dataKey:"Water Level Value",
            data:response['data']['val']
          }
          const min_data = {
            stroke:"#8FE3CF",
            dataKey:"Minimun",
            data:response['data']['val']
          }
          const max_data = {
            stroke:"#256D85",
            dataKey:"Maximun",
            data:response['data']['max']
          }
          
          // const data_object={
          //   normal: normal_data,
          //   minimun: min_data,
          //   maximun: max_data
          // }
          const data_list =[normal_data,min_data,max_data]

          setDataObject(data_list)
          console.log(data_list)
          // console.log(response['data']['val'])
          // console.log(response['data']['max'])
          // console.log(response['data']['min'])


          setLoading(false);
          setIsFullMap(false);

      } catch (error) {
        console.error(error.message);
        setLoading(false);

      }
    }
    if(selectedFeature !== ""){
      fetchData();
      
    }
    else{

      console.log("Not Requesting data")
    }

	}, [selectedFeature]);

  // useEffect(() => {
  //   setLoading(true);

  //   const Mydata = {
  //     'product': dataGeoglows
  //   }
  //   const config = {
  //     header: {
  //       "Content-Type": "application/json",
  //     },
  //   };
  //   console.log(Mydata);
  //   const service_link = 'http://127.0.0.1:8000/apps/hydroweb/getVirtualStationData/';
  //   const fetchData= async () =>{
  //     try {
  //         const {data: response} = await axios.post(service_link,Mydata,config);
  //         // const newArrayMax = array.map(({dropAttr1, dropAttr2, ...keepAttrs}) => keepAttrs)

  //         // const {data: response} = await axios.post(service_link);
  //         // console.log(response)
  //         // setDataStation(response['data'])
  //         setDataStation(response['data']['val'])
  //         setMinDataStation(response['data']['min'])
  //         setMaxDataStation(response['data']['max'])
  //         console.log(response['data']['val'])
  //         console.log(response['data']['max'])
  //         console.log(response['data']['min'])


  //         setLoading(false);
  //         setIsFullMap(false);

  //     } catch (error) {
  //       console.error(error.message);
  //       setLoading(false);

  //     }
  //   }
  //   if(selectedFeature !== ""){
  //     fetchData();
      
  //   }
  //   else{

  //     console.log("Not Requesting data")
  //   }

	// }, [dataGeoglows]);

  useEffect(() => {
    // setLoading(true);

    console.log(selectedGeoglows)
    const Mydata = {
      'reach_id': selectedGeoglows,
      'product': selectedFeature,
      'return_format':'json'
    }

  
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    console.log(Mydata);
    const service_link = 'http://127.0.0.1:8000/apps/hydroweb/saveHistoricalSimulationData/';

    const fetchData= async () =>{
      try {
          const {data: response} = await axios.post(service_link,Mydata,config);

      } catch (error) {
        console.error(error.message);
        setLoading(false);

      }
    }
    if(selectedFeature !== ""){
      fetchData();
      
    }
    else{

      console.log("Not Requesting data")
    }

	}, [listGeoglowsApiCalls]);


  useEffect(() => {
    // setLoading(true);

    console.log(selectedGeoglows)
    const Mydata = {
      'reach_id': selectedGeoglows,
      'product': selectedFeature,
      'return_format':'json'
    }

  
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    console.log(Mydata);
    const service_link = 'http://127.0.0.1:8000/apps/hydroweb/executeBiasCorrection/';

    const fetchData= async () =>{
      try {
          const {data: response} = await axios.post(service_link,Mydata,config);

      } catch (error) {
        console.error(error.message);
        setLoading(false);

      }
    }
    if(selectedFeature !== ""){
      fetchData();
      
    }
    else{

      console.log("Not Requesting data")
    }

	}, [isBiasCorrectionOn]);


  return (
    <div>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {setIsError(false);setDataObject({})}}
        resetKeys={[isError,dataObject]}>
      <Loader_wrapper loading={ loading }/>
      
      <ContainerFlex>
        <SideMenuWrapper 
          onLayer = { onOffLayer}
          layer = {showLayer1}
        />
        {/* <JobsMenu /> */}
      <SplitContainer >
        <Map center={fromLonLat(center)} zoom={zoom} setSelectedFeature ={setSelectedFeature} isFullMap={isFullMap} setSelectedGeoglows={setSelectedGeoglows} >
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

                    if(size < 2){
                      feature.get("features").forEach(function(feature) {
                        var river_index = feature.get("river_name");
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
        {/* <LowerMenuWrapper xyData={ dataStation } xyMin= { minDataStation } xyMax={ maxDataStation }  executeGeoglows={executeGeoglows} isFullMap={ isFullMap } /> */}
        <LowerMenuWrapper xyData ={dataObject}  executeGeoglows={executeGeoglows} executeBiasCorrection={executeBiasCorrection} isFullMap={ isFullMap } />

        
      </SplitContainer>



      </ContainerFlex>
    
      </ErrorBoundary>
    </div>
  );
};

export default App;