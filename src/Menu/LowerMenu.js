import React, { useState } from "react";
import { LowerMenu } from "../styles/LowerMenu.styled";
import { LineXYChartWrapper } from "../Charts";
import Button_group from "../Extra/Button_group"
import LegendSwitcherWrapper from "../Menu/LegendSwitcher";

const LowerMenuWrapper = ({ xyData, executeGeoglows, executeBiasCorrection,executeHydroWebData,executeForecast, setDataObject, isFullMap,isHydroDataOn, isGeoglowsActive, isBiasCorrectionOn, isForecastOn}) => {
  
  const[legendToggle, setLegendToggle] = useState({
    'Water Level Value': true,
    'Maximun': true,
    'Minimun': true,
    'Historical Simulation':true,
    'Forecast 25-75 Percentile StreamFlow': true,
    'Forecast Minimun-Maximun StreamFlow': true,
    'Bias Corrected Mean Level':true,
    'Bias Corrected Minimun Level': true,
    'Bias Corrected Maximun Level':true,
    'Forecast Mean StreamFlow': true,
    'Forecast Minimun StreamFlow': true,
    'Forecast Maximun StreamFlow': true,
    '1st Days Forecasts Maximum-Minimum Records': true,
    'High Resolution Minimum-Maximum Forecast Records (1st Days Forecasts Records)':true,
    'Forecast High Resolution StreamFlow': true
  })


  return(
    
      <LowerMenu>
        <Button_group executeGeoglows = {executeGeoglows} executeBiasCorrection={executeBiasCorrection} executeHydroWebData={executeHydroWebData} executeForecast={executeForecast} isFullMap={isFullMap} />
        <div id="graph_and_legend">
          <LineXYChartWrapper xyData={xyData} setDataObject={setDataObject} isHydroDataOn={isHydroDataOn} isGeoglowsActive={isGeoglowsActive} isBiasCorrectionOn={isBiasCorrectionOn} isForecastOn={isForecastOn} legendToggle={legendToggle} />
          <LegendSwitcherWrapper xyData={xyData} isHydroDataOn={isHydroDataOn} isGeoglowsActive={isGeoglowsActive} isBiasCorrectionOn={isBiasCorrectionOn} isForecastOn={isForecastOn}  legendToggle={legendToggle} setLegendToggle = {setLegendToggle}/>

        </div>
        
        {/* <LineXYChartWrapper xyData={xyData} xyMin= { xyMin } xyMax={ xyMax } /> */}
      </LowerMenu>


  );
};

export default LowerMenuWrapper;