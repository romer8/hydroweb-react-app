import React from "react";
import { LowerMenu } from "../styles/LowerMenu.styled";
import { LineXYChartWrapper } from "../Charts";
import Button_group from "../Extra/Button_group"
const LowerMenuWrapper = ({ xyData, executeGeoglows, executeBiasCorrection,executeHydroWebData,executeForecast, setDataObject, isFullMap,isHydroDataOn, isGeoglowsActive, isBiasCorrectionOn, isForecastOn}) => {

  return(
    
      <LowerMenu>
        <Button_group executeGeoglows = {executeGeoglows} executeBiasCorrection={executeBiasCorrection} executeHydroWebData={executeHydroWebData} executeForecast={executeForecast} isFullMap={isFullMap} />
        <LineXYChartWrapper xyData={xyData} setDataObject={setDataObject} isHydroDataOn={isHydroDataOn} isGeoglowsActive={isGeoglowsActive} isBiasCorrectionOn={isBiasCorrectionOn} isForecastOn={isForecastOn} />
        {/* <LineXYChartWrapper xyData={xyData} xyMin= { xyMin } xyMax={ xyMax } /> */}
      </LowerMenu>


  );
};

export default LowerMenuWrapper;