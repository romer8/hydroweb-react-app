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
import { graph_styles } from "./styles/Graphs_styles";

import Loader_wrapper from "./Extra/Loader_wrapper";

import { WebSocketWrapper } from "./WebsocketWrapper";
import {ErrorBoundary} from 'react-error-boundary'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';



function JSON2CSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

  var str = '';
  var line = '';

  // get all distinct keys      
  let titles = [];
  for (var i = 0; i < array.length; i++) {
    let obj = array[i];
    Object.entries(obj).forEach(([key,value])=>{
      //console.log('key=', key, "   val=", value );
      if (titles.includes(key) ) {
        console.log (key , 'exists');
        // null;
      }
      else {
        titles.push(key);
      }
    })
  }
  let htext =  '"' + titles.join('","') + '"';
  console.log('header:', htext);
  // add to str
  str += htext + '\r\n';
  //
  // lines
  for (var i = 0; i < array.length; i++) {
    var line = '';
    // get values by header order
    for (var j = 0; j < titles.length; j++) {
      // match keys with current header
      let obj = array[i];
      let keyfound = 0;    
      // each key/value pair
      Object.entries(obj).forEach(([key,value])=>{
        if (key === titles[j]) {
          // console.log('equal tit=', titles[j] , ' e key ', key ); // matched key with header
          line += ',"' + value +  '"';
          keyfound = 1; 
          return false;
        }

      })
      if (keyfound === 0) {
        line += ',"'  +  '"';   // add null value for this key
      } // end loop of header values

    }

    str += line.slice(1) + '\r\n';
  }
  return str;
}


function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const clusterDistance = 50;
const minClusterDistance = 50;
const styleCache = {};

const ws = 'ws://' + 'localhost:8000/apps/hydroweb' + '/data-notification/notifications/ws/';

const App = () => {
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(mapConfig.zoom);
  const [showLayer1, setShowLayer1] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [clusterDistance, setClusterDistance] = useState(50);
  // const [minClusterDistance, setMinClusterDistance] = useState(50);
  // const [styleCache, setStyleCache] = useState({});
  const [selectedFeature, setSelectedFeature] = useState("");
  const [selectedGeoglows, setSelectedGeoglows] = useState("")
  // const [dataStation, setDataStation] = useState([]);
  // const [minDataStation, setMinDataStation] = useState([]);
  // const [maxDataStation, setMaxDataStation] = useState([]);
  // const [dataGeoglows, setDataGeoglows] = useState({});
  const [listGeoglowsApiCalls, setListGeoglowsApiCalls] = useState([]);
  const [listBiasCorrection, setListBiasCorrection] = useState([]);
  const [lisForecast, setListForecast] = useState([]);

  const [isFullMap, setIsFullMap] = useState(true)
  const [isGeoglowsActive, setIsGeoglowsActive] = useState(false)
  const [dataObject,setDataObject] = useState([]);
  const [isBiasCorrectionOn, setIsBiasCorrectionOn] = useState(false);
  const [isHydroDataOn, setIsHydroDataOn] = useState(false);
  const [isForecastOn, setIsForecastOn] = useState(false);
  const [isForecastBiasCorrectedDataPlot, setIsForecastBiasCorrectedDataPlot] = useState(false)
  const socketRef = useRef();
  const [isError, setIsError] = React.useState(false)
  const [isSuccessfulHydroWeb, setIsSuccessfulHydroWeb] = useState(false);
  const [isSuccessfulHistoricalSimulation, setIsSuccessfulHistoricalSimulation] = useState(false);
  const [isSuccessfulHistoricalBiasCorrection, setIsSuccessfulHistoricalBiasCorrection] = useState(false);
  const [isSuccessfulForecastBiasCorrection, setIsSuccessfulForecastBiasCorrection] = useState(false);



  const downloadData = (type_data) => {
    const service_link = 'http://127.0.0.1:8000/apps/hydroweb/download/';
    const Mydata = {
      'product': selectedFeature,
      'type_data': type_data,
      'reach_id': selectedGeoglows
    }
    // axios.get(service_link, )
    // debugger()
    if(type_data.includes('Forecast')){
      if(dataObject.length > 0){
        debugger
        // var jsonData = dataObject?.map( x=>x.dataKey === type_data )[0]['data']
        const jsonData = dataObject.filter(item => item.dataKey === type_data)[0]['data']

        var csv = JSON2CSV(jsonData);
        var downloadLink = document.createElement("a");
        var blob = new Blob(["\ufeff", csv]);
        var url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = `${type_data}.csv`;
  
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }

    }
    else{
      axios.post(service_link,Mydata,{responseType: 'blob'}).then(function (response) {
        if (!window.navigator.msSaveOrOpenBlob){
          // BLOB NAVIGATOR
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${type_data}.csv`);
          document.body.appendChild(link);
          link.click();
        }else{
          // BLOB FOR EXPLORER 11
          const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]),`${type_data}.csv`);
        }
  
    });
    }

}


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

  const onClickFeature = (e) => {
    console.log(e)
  }

  // const isHydroDataOnHandler = ()=>{
  //   setIsHydroDataOn(!isHydroDataOn);
  // };


  const executeGeoglows = () => {
    // setIsGeoglowsActive(!isGeoglowsActive);
    // console.log(isGeoglowsActive);
    // var new_job = `${selectedFeature}-->${selectedGeoglows}`;
    // console.log(new_job)
    // var found = listGeoglowsApiCalls.some(p => p = new_job)
    // console.log(found)
    // if(!found){
    //   setListGeoglowsApiCalls(listGeoglowsApiCalls => [...listGeoglowsApiCalls, new_job]);
    //   // setIsGeoglowsActive(!isGeoglowsActive);

    // }

    setIsGeoglowsActive(true);
    setIsForecastOn(false)

    setIsHydroDataOn(false);
    setIsBiasCorrectionOn(false);

    // console.log(listGeoglowsApiCalls)
  };

  const executeBiasCorrection = () => {
    console.log(isBiasCorrectionOn);
    // var new_job = `${selectedFeature}-->${selectedGeoglows}`;
    // console.log(new_job)
    // var found = listBiasCorrection.some(p => p === new_job)
    // console.log(found)
    // if(!found){
    //   setListBiasCorrection(listBiasCorrection => [...listBiasCorrection, new_job]);
    //   // setIsGeoglowsActive(!isGeoglowsActive);

    // }
  
    // setIsBiasCorrectionOn(true);
    setIsBiasCorrectionOn(true);
    setIsForecastOn(false)

    setIsHydroDataOn(false);
    setIsGeoglowsActive(false);
    
    // if(found){
    //   // setBiasCorrectionOn(!isBiasCorrectionOn);
    //   setIsBiasCorrectionOn(true);
    //   setIsHydroDataOn(false);
    //   setIsGeoglowsActive(false);
    // }
    // else{
    //   setIsBiasCorrectionOn(true);
    //   setIsHydroDataOn(false);
    //   setIsGeoglowsActive(false);
    // }
  };
  const executeForecast = () => {
    // console.log(isForecastOn);
    // var new_job = `${selectedFeature}-->${selectedGeoglows}`;
    // console.log(new_job)
    // var found = lisForecast.some(p => p === new_job)
    // console.log(found)
    // if(!found){
    //   setListForecast(lisForecast => [...lisForecast, new_job]);
    //   // setIsGeoglowsActive(!isGeoglowsActive);

    // }
  
    // setIsBiasCorrectionOn(true);
    setIsForecastOn(true)
    setIsBiasCorrectionOn(false);
    setIsHydroDataOn(false);
    setIsGeoglowsActive(false);
  
  };
  
  const executeHydroWebData = ()=>{
    setIsBiasCorrectionOn(false);
    setIsGeoglowsActive(false);
    setIsHydroDataOn(true);
    setIsForecastOn(false);

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
  useEffect(()=>{
    if(!socketRef.current) return;
    socketRef.current.onmessage = function (e) {
      let data = JSON.parse(e.data);
      let reach_id2 = data['reach_id'];
      let product2 = data['product'];
      let command = data['command'];
      console.log(data);
      if (command === "Data_Downloaded"){
      // if (command == "Data_Downloaded" && isForecastOn == false){

        socketRef.current.send(
          JSON.stringify({
            type: "plot_hs_data",
            reach_id:reach_id2,
            product: product2

          })
        );
      }
      // if (command == "Data_Downloaded" && isForecastOn == true){
      //   setIsForecastBiasCorrectedDataPlot(true);
      // }

      if (command === "Plot_Data"){
        var found = dataObject.filter(p => p.dataKey === 'Historical Simulation').length > 0  ? true : false;
        if(!found){
          console.log("ADDING THE HISTORICAL SIMULATION DATA")
          let dataHistorical = JSON.parse(data['data']);
          const dataHistoricalObject = {
            color_fill: graph_styles["Historical Simulation"],
            dataKey:"Historical Simulation",
            key:"Historical Simulation",
            data:dataHistorical,
            visible:isGeoglowsActive
          }
          console.log(dataHistoricalObject)
        
          setDataObject(dataObject => [...dataObject,dataHistoricalObject ])
          // setDataGeoglows(dataHistorical);

          setIsSuccessfulHistoricalSimulation(true);
          

        }
      }
      if(command === "Bias_Data_Downloaded"){
        socketRef.current.send(
          JSON.stringify({
            type: "plot_bias_corrected_data",
            reach_id:reach_id2,
            product: product2

          })
        );
      }
      if (command === "Plot_Bias_Corrected_Data"){
        // var found = dataObject.some(p => p.dataKey === 'Bias Corrected Mean Level');
        var found = dataObject.filter(p => p.dataKey === 'Bias Corrected Mean Level').length > 0 ? true : false;

        if(!found){
          console.log("ADDING THE BIAS CORRECTED FORECAST ENSEMBLE SIMULATION DATA")

          let dataBiasCorrrected = data['data'];

          console.log(dataBiasCorrrected)

          // setDataGeoglows(dataHistorical);
          const normal_bc_data = {
            color_fill:graph_styles["Bias Corrected Mean Level"],
            dataKey:"Bias Corrected Mean Level",
            key:"Bias Corrected Mean Level",
            data:data['data']['val'],
            visible:isBiasCorrectionOn

          }
          const min_bc_data = {
            color_fill:graph_styles['Bias Corrected Minimun Level'],
            dataKey:"Bias Corrected Minimun Level",
            key:"Bias Corrected Minimun Level",
            data:data['data']['val'],
            visible:isBiasCorrectionOn

          }
          const max_bc_data = {
            color_fill:graph_styles['Bias Corrected Maximun Level'],
            dataKey:"Bias Corrected Maximun Level",
            key:"Bias Corrected Maximun Level",
            data:data['data']['max'],
            visible:isBiasCorrectionOn

          }
          setDataObject(dataObject => [...dataObject,normal_bc_data,min_bc_data,max_bc_data ]);
          setIsSuccessfulHistoricalSimulation(true);
          setIsSuccessfulHistoricalBiasCorrection(true);

        }


      }
      
      if(command === "Plot_Forecast_Ensemble_Bias_Data_Downloaded"){
        setIsForecastBiasCorrectedDataPlot(false);
        // var found = dataObject.some(p => p.dataKey === 'Mean Ensemble');
        // var found = dataObject.filter(p => p.dataKey === 'Mean Ensemble').length > 0 ? true : false;
        var found = dataObject.filter(p => p.dataKey.includes('Forecast')).length > 0 ? true : false;

        console.log(found)
        if(!found){
          console.log("ADDING THE BIAS CORRECTED HISTORICAL SIMULATION DATA")

          let dataForecastBiasCorrrected = data['data'];

          console.log(dataForecastBiasCorrrected)

          // setDataGeoglows(dataHistorical);
          const mean_ensemble = {
            color_fill:graph_styles['Forecast Mean StreamFlow'],
            dataKey:"Forecast Mean StreamFlow",
            key:"Forecast Mean StreamFlow",
            data:dataForecastBiasCorrrected['mean'],
            visible:isForecastOn

          }
          const max_min_ensemble = {
            color_fill:graph_styles['Forecast Minimun-Maximun StreamFlow'],
            dataKey:"Forecast Minimun-Maximun StreamFlow",
            key:"Forecast Minimun-Maximun StreamFlow",
            data:dataForecastBiasCorrrected['max_min'],
            visible:isForecastOn  
          }
          const min_ensemble = {
            color_fill:graph_styles['Forecast Minimun StreamFlow'],
            dataKey:"Forecast Minimun StreamFlow",
            Key:"Forecast Minimun StreamFlow",
            data:dataForecastBiasCorrrected['min'],
            visible:isForecastOn

          }
          const max_ensemble = {
            color_fill:graph_styles['Forecast Maximun StreamFlow'],
            dataKey:"Forecast Maximun StreamFlow",
            Key:"Forecast Maximun StreamFlow",
            data:dataForecastBiasCorrrected['max'],
            visible:isForecastOn
          }
          const p25_ensemble = {
            dataKey:"Forecast 25 Percentile StreamFlow",
            key:"Forecast 25 Percentile StreamFlow",
            data:dataForecastBiasCorrrected['p25'],
            visible:isForecastOn,
            color_fill:graph_styles['Forecast 25 Percentile StreamFlow']
          }
          const p75_ensemble = {
            // stroke:"#002500",
            color_fill:graph_styles['Forecast 75 Percentile StreamFlow'],
            dataKey:"Forecast 75 Percentile StreamFlow",
            Key:"Forecast 75 Percentile StreamFlow",
            data:dataForecastBiasCorrrected['p75'],
            visible:isForecastOn
          }
          const p75_25_ensemble = {
            // stroke:"#002500",
            color_fill:graph_styles['Forecast 25-75 Percentile StreamFlow'],
            dataKey:"Forecast 25-75 Percentile StreamFlow",
            key:"Forecast 25-75 Percentile StreamFlow",
            data:dataForecastBiasCorrrected['p75_25'],
            visible:isForecastOn

          }
          const high_res_ensemble = {
            dataKey:"Forecast High Resolution StreamFlow",
            key:"Forecast High Resolution StreamFlow",
            data:dataForecastBiasCorrrected['high_res'],
            visible:isForecastOn,
            color_fill:graph_styles['Forecast High Resolution StreamFlow']


          }
          // setDataObject(dataObject => [...dataObject,mean_ensemble,min_ensemble,max_ensemble,p25_ensemble,p75_ensemble,high_res_ensemble ]);
          setDataObject(dataObject => [...dataObject,mean_ensemble,max_min_ensemble,p75_25_ensemble,high_res_ensemble,p25_ensemble,p75_ensemble,min_ensemble,max_ensemble ]);
        
        }
      }
      if(command === "Plot_Forecast_Records_Bias_Data_Downloaded"){
        setIsForecastBiasCorrectedDataPlot(false);
        // var found = dataObject.some(p => p.dataKey.includes('Records'));
        var found = dataObject.filter(p => p.dataKey.includes('Records')).length > 0 ? true : false;

        console.log(found)
        if(!found){
          console.log("ADDING THE BIAS CORRECTED FORECAST RECORDS SIMULATION DATA")

          let dataForecastBiasCorrrected = data['data'];

          console.log(dataForecastBiasCorrrected);
          if(dataForecastBiasCorrrected['record_plot1']){
            const record_plot1 = {
              color_fill:graph_styles['1st Days Forecast Records'],
              dataKey:"1st Days Forecast Records",
              key:"1st Days Forecast Records",
              data:dataForecastBiasCorrrected['record_plot1'],
              visible:isForecastOn
            }
            setDataObject(dataObject => [...dataObject,record_plot1]);

          }
          if(dataForecastBiasCorrrected['max_min_area_record_WL']){
            // const max_min_record_WL = {
            //   // stroke:"#FFA15A",
            //   dataKey:"1st Days Forecasts Records",
            //   data:dataForecastBiasCorrrected['max_min_record_WL'],
            //   visible:isForecastOn
            // }
            const max_min_area_record_WL = {
              color_fill:graph_styles['1st Days Forecasts Maximum-Minimum Records'],
              dataKey:"1st Days Forecasts Maximum-Minimum Records",
              key:"1st Days Forecasts Maximum-Minimum Records",
              data:dataForecastBiasCorrrected['max_min_area_record_WL'],
              visible:isForecastOn
            }
            const max_record_WL = {
              color_fill:graph_styles['1st Days Forecasts Maximun Records'],
              dataKey:"1st Days Forecasts Maximun Records",
              key:"1st Days Forecasts Maximun Records",
              data:dataForecastBiasCorrrected['max_record_WL'],
              visible:isForecastOn
            }
            const min_record_WL = {
              color_fill:graph_styles['1st Days Forecasts Minimun Records'],
              dataKey:"1st Days Forecasts Minimun Records",
              key:"1st Days Forecasts Minimun Records",
              data:dataForecastBiasCorrrected['min_record_WL'],
              visible:isForecastOn
            }
            // setDataObject(dataObject => [...dataObject,max_min_record_WL,max_record_WL,min_record_WL]);
            setDataObject(dataObject => [...dataObject,max_min_area_record_WL,max_record_WL,min_record_WL]);

          }
          if(dataForecastBiasCorrrected['max_min_high_res_WL']){
            const max_min_high_res_WL = {
              color_fill:graph_styles['High Resolution Minimum-Maximum Forecast Records (1st Days Forecasts Records)'],
              dataKey:"High Resolution Minimum-Maximum Forecast Records (1st Days Forecasts Records)",
              key:"High Resolution Minimum-Maximum Forecast Records (1st Days Forecasts Records)",
              data:dataForecastBiasCorrrected['max_min_high_res_WL'],
              visible:isForecastOn
            }
            const max_high_res_WL = {
              color_fill:graph_styles['High Resolution Maximum (1st Days Forecasts Records)'],
              dataKey:"High Resolution Maximum (1st Days Forecasts Records)",
              key:"High Resolution Maximum (1st Days Forecasts Records)",
              data:dataForecastBiasCorrrected['max_high_res_WL'],
              visible:isForecastOn
            }
            const min_high_res_WL = {
              color_fill:graph_styles['High Resolution Minimum (1st Days Forecasts Records)'],
              dataKey:"High Resolution Minimum (1st Days Forecasts Records)",
              key:"High Resolution Minimum (1st Days Forecasts Records)",
              data:dataForecastBiasCorrrected['min_high_res_WL'],
              visible:isForecastOn
            }
            // setDataObject(dataObject => [...dataObject,max_min_high_res_WL,max_high_res_WL,min_high_res_WL]);
            setDataObject(dataObject => [...dataObject,max_min_high_res_WL,max_high_res_WL,min_high_res_WL]);
            setIsSuccessfulForecastBiasCorrection(true);

          }
        }

      }

    };
  },[isBiasCorrectionOn,isForecastOn,isHydroDataOn,isGeoglowsActive])
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
    toast.promise(fetchStations, {
      pending: 'Loading Stations ...',
      success: 'Successfully Stations 👌',
      error: 'Failed to Retrieve Stations',
    });
    // fetchStations();


    socketRef.current = new WebSocket(ws);
      socketRef.current.onopen = () => {
        console.log("WebSocket is Open");
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

    // setDataObject([]);
    console.log("Hydroweb data activated",selectedFeature)

    const Mydata = {
      'product': selectedFeature
    }
    const config = {
      header: {
        "Content-Type": "application/json"
      },
    };
    // console.log(Mydata);
    const service_link = 'http://127.0.0.1:8000/apps/hydroweb/getVirtualStationData/';
    const fetchData= async () =>{

      // const id = toast.loading("Loading Hydroweb Water Level Data ...")

      try {
          const {data: response} =  await axios.post(service_link,Mydata,config)
          
          
          // toast.promise(response,{
          //   pending: 'Loading Hydroweb Water Level Data ...',
          //   success: { render: 'Successfully Loaded Hydroweb Water Level Data 👌', delay: 1000 },
          //   error: { render: 'Failed to Retrieve Hydroweb Water Level Data', delay: 100 },
          // });

          console.log(response)

          const normal_data = {
            // stroke:"#2B4865",
            dataKey:"Water Level Mean Value",
            color_fill:graph_styles["Water Level Mean Value"],
            key:"Water Level Value",
            data:response['data']['val'],
            visible:isHydroDataOn

          }
          const min_max_data = {
            color_fill: graph_styles["Water Level Maximun-Minimun"],
            dataKey:"Water Level Maximun-Minimun",
            key:"Water Level Maximun-Minimun",
            data:response['data']['min_max'],
            visible:isHydroDataOn

          }
          const min_data = {
            color_fill: graph_styles["Water Level Minimun"],
            dataKey:"Water Level Minimun",
            key:"Water Level Minimun",
            data:response['data']['min'],
            visible:isHydroDataOn
          }
          const max_data = {
            color_fill:graph_styles["Water Level Maximun"],
            dataKey:"Water Level Maximun",
            key:"Water Level Maximun",
            data:response['data']['max'],
            visible:isHydroDataOn
          }
          
          // const data_object={
          //   normal: normal_data,
          //   minimun: min_data,
          //   maximun: max_data
          // }
          // setIsBiasCorrectionOn(false)
          // setIsForecastOn(false)
          // setIsGeoglowsActive(false)

          const data_list =[normal_data,min_max_data,min_data,max_data]
          // const data_list =[normal_data,min_data,max_data]

          // var found = dataObject.filter(p => p.dataKey === "Water Level Mean Value").length > 0  ? true : false;
          // if(!found || dataObject.length > 4){
          //   setDataObject(data_list)
          // }
          setDataObject(data_list)

          // setDataObject(data_list)

          // console.log(data_list)
          // console.log(response['data']['val'])
          // console.log(response['data']['max'])
          // console.log(response['data']['min'])



          setLoading(false);
          setIsFullMap(false);
          setIsSuccessfulHydroWeb(true);
          setIsSuccessfulHistoricalSimulation(false);
          setIsSuccessfulHistoricalBiasCorrection(false);
          setIsSuccessfulForecastBiasCorrection(false);
          
          // toast.update(id, { render: "Successfully Loaded Hydroweb Water Level Data 👌", type: "success", isLoading: false,autoClose: 1000, delay: 2000 });
          // toast.dismiss(id); 



      } catch (error) {
        console.error(error.message);
        setLoading(false);
        setIsSuccessfulHydroWeb(false);
        // toast.update(id, { render: "Failed to Retrieve Hydroweb Water Level Data", type: "error", isLoading: false,autoClose: 1000, delay: 2000 });
        // toast.dismiss(id); 

      }

    }
    if(selectedFeature !== "" && isHydroDataOn){

      // var found = dataObject.filter(p => p.dataKey === "Water Level Mean Value").length > 0  ? true : false;
      if(dataObject.length < 4){
        // fetchData()
          toast.promise(fetchData,{
            success: { render: 'Successfully Loaded Hydroweb Water Level Data 👌'},
            error: { render: 'Failed to Retrieve Hydroweb Water Level Data'},
          });

      }

      // else{
        // setLoading(false);

      // }
        // fetchData()
        // setLoading(false);

    }
    else{
      setLoading(false);
      // toast.update(id, { render: "All is good", type: "success", isLoading: false,autoClose: 1000 });

    }
  
    return () => {
      // setLoading(false);
      // toast.update(id, { render: "All is good", type: "success", isLoading: false,autoClose: 1000 });

      // setIsHydroDataOn(false);
    }

	}, [selectedFeature, isHydroDataOn]);

  useEffect(() => {

    console.log("Historical Simulation data Save activated",selectedGeoglows)
    const Mydata = {
      'reach_id': selectedGeoglows,
      'product': selectedFeature,
      'return_format':'json'
    }

  
    const config = {
      header: {
        "Content-Type": "application/json"
      },
    };
    // console.log(Mydata);
    const service_link = 'http://127.0.0.1:8000/apps/hydroweb/saveHistoricalSimulationData/';

    const fetchData= async () =>{
      try {
          setLoading(true);

          const {data: response} = await axios.post(service_link,Mydata,config);
          // setIsHydroDataOn(false);
          // setIsBiasCorrectionOn(false);
          // setIsForecastBiasCorrectedDataPlot(false)
          // setIsGeoglowsActive(true);
          // setLoading(false);
          // setIsGeoglowsActive(true);
          setLoading(false);
          
      } catch (error) {
        console.error(error.message);
        // setLoading(false);
      }
    }
    if(selectedFeature !== "" && isGeoglowsActive ){
      var found = dataObject.filter(p => p.dataKey === 'Historical Simulation').length > 0  ? true : false;

      if (!found){
      // fetchData();
        toast.promise(fetchData, {
          // pending: 'Loading GEOGloWS Historical Simulation Data ...',
          success: 'Successfully Loaded GEOGloWS Historical Simulation Data 👌',
          error: 'Failed to Retrieve GEOGloWS Historical Simulation Data',
        });
      }
      // else{
        // setLoading(false);
      // }

      
    }
    else{
      setLoading(false);
      // toast.update(id, { render: "All is good", type: "success", isLoading: false,autoClose: 1000 });

    }


	}, [selectedFeature, selectedGeoglows, isGeoglowsActive ]);
  // listGeoglowsApiCalls

  useEffect(() => {
    console.log("Bias Correction data Save activated",selectedGeoglows,selectedFeature)

    // console.log(selectedGeoglows)
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
    // console.log(Mydata);
    const service_link = 'http://127.0.0.1:8000/apps/hydroweb/executeBiasCorrection/';

    const fetchData= async () =>{
      try {
          setLoading(true);

          const {data: response} = await axios.post(service_link,Mydata,config);
          // setIsBiasCorrectionOn(true);
          // setIsHydroDataOn(false);
          // setIsGeoglowsActive(false);
          setLoading(false);


      } catch (error) {
        console.error(error.message);
        setLoading(false);

      }
    }
    if(selectedFeature !== "" && isBiasCorrectionOn){
      var found = dataObject.filter(p => p.dataKey === 'Bias Corrected Mean Level').length > 0 ? true : false;

      if(!found){      
        toast.promise(fetchData, {
          // pending: 'Loading GEOGloWS Historical Simulation Bias Corrected Data ...',
          success: 'Successfully Loaded GEOGloWS Historical Simulation Bias Corrected Data 👌',
          error: 'Failed to Retrieve GEOGloWS Historical Simulation Bias Corrected Data',
        });
      }
      // else{
        // setLoading(false);

      // }
      
    }
    else{
      setLoading(false);

    }
    return ()=>{
      // setLoading(false);
     }


	}, [selectedFeature,selectedGeoglows, isBiasCorrectionOn]);
  // listBiasCorrection

  useEffect(() => {
    console.log("Forecast data Save activated",selectedGeoglows,selectedFeature)

    // console.log(selectedGeoglows)
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
    // console.log(Mydata);
    const service_link = 'http://127.0.0.1:8000/apps/hydroweb/saveForecastData/';

    const fetchData= async () =>{
      try {
        setLoading(true);

          const {data: response} = await axios.post(service_link,Mydata,config);
          // setIsBiasCorrectionOn(true);
          // setIsHydroDataOn(false);
          // setIsGeoglowsActive(false);
          setLoading(false);
          setIsForecastBiasCorrectedDataPlot(true);

      } catch (error) {
        console.error(error.message);
        setLoading(false);

      }
    }
    if(selectedFeature !== "" && isForecastOn){
      // fetchData();
      // var found = dataObject.filter(p => p.dataKey === 'Mean Ensemble').length > 0 ? true : false;
      var found_records = dataObject.filter(p => p.dataKey.includes('Forecast') ).length > 0 ? true : false;
      if(!found_records){
        
        toast.promise(fetchData, {
          // pending: 'Saving GEOGloWS Forecast Data ...',
          success: 'Successfully Saved GEOGloWS Forecast Data 👌',
          error: 'Failed Saved GEOGloWS Forecast Data',
        });
      }

      
    }
    else{

      console.log("Not Requesting data")
    }
    return ()=>{
      // setLoading(false);
     }

	}, [selectedFeature,selectedGeoglows, isForecastOn]);



  useEffect(() => {
    console.log("Forecast Bias Correction data Save activated",selectedGeoglows,selectedFeature)

    if(isForecastBiasCorrectedDataPlot){
        setLoading(true);
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
      const service_link = 'http://127.0.0.1:8000/apps/hydroweb/executeForecastBiasCorrection/';
      const fetchData= async () =>{
        try {
            const {data: response} = await axios.post(service_link,Mydata,config);
            // setIsBiasCorrectionOn(true);
            // setIsHydroDataOn(false);
            // setIsGeoglowsActive(false);
            setLoading(false);
            setIsForecastBiasCorrectedDataPlot(false);


        } catch (error) {
          console.error(error.message);
          setLoading(false);

        }
      }
      if(selectedFeature !== ""){
        // fetchData();
        toast.promise(fetchData, {
          // pending: 'Executing Bias Correction to GEOGloWS Forecast Data ...',
          success: 'Successfully Retrieved Bias Corrected GEOGloWS Forecast Data 👌',
          error: 'Failed to Retrieve Bias Corrected GEOGloWS Forecast Data',
        });
        
      }
      else{

        console.log("Not Requesting data")
      }
    }
    return () =>{
      setIsForecastBiasCorrectedDataPlot(false);
      // setLoading(false);
    }

	}, [isForecastBiasCorrectedDataPlot]);


  return (
    <div className="hiddenElement">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {setIsError(false);setDataObject({})}}
        resetKeys={[isError,dataObject]}>
      <Loader_wrapper loading={ loading }/>
      <ToastContainer limit={1} autoClose={1000} theme={"dark"}/>
      <ContainerFlex>
        <SideMenuWrapper 
          onLayer = { onOffLayer}
          layer = {showLayer1}
        />
        {/* <JobsMenu /> */}
      <SplitContainer >
        <Map center={fromLonLat(center)} zoom={zoom} setSelectedFeature ={setSelectedFeature} isFullMap={isFullMap} setSelectedGeoglows={setSelectedGeoglows} setIsHydroDataOn={setIsHydroDataOn} selectedFeature ={selectedFeature} setIsGeoglowsActive = {setIsGeoglowsActive} setIsBiasCorrectionOn={setIsBiasCorrectionOn} setDataObject = {setDataObject} setIsForecastOn = {setIsForecastOn}>
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
                        // setStyleCache(styleCache => ({...styleCache, size: style}))
  
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
          
          <LowerMenuWrapper 
            xyData ={dataObject}  
            executeGeoglows={executeGeoglows} 
            executeBiasCorrection={executeBiasCorrection} 
            executeHydroWebData={executeHydroWebData} 
            executeForecast={executeForecast} 
            setDataObject = {setDataObject} 
            isFullMap={ isFullMap } 
            isHydroDataOn={isHydroDataOn} 
            isGeoglowsActive={isGeoglowsActive} 
            isBiasCorrectionOn={isBiasCorrectionOn} 
            isForecastOn={isForecastOn}
            isSuccessfulHydroWeb={isSuccessfulHydroWeb}
            isSuccessfulHistoricalSimulation = {isSuccessfulHistoricalSimulation}
            isSuccessfulHistoricalBiasCorrection = {isSuccessfulHistoricalBiasCorrection}
            isSuccessfulForecastBiasCorrection = {isSuccessfulForecastBiasCorrection}
            downloadData = {downloadData}

          />  
        

        
      </SplitContainer>



      </ContainerFlex>
    
      </ErrorBoundary>
    </div>
  );
};

export default App;