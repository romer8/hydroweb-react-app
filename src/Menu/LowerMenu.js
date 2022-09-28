import React from "react";
import { LowerMenu } from "../styles/LowerMenu.styled";
import { LineXYChartWrapper } from "../Charts";
import Button_group from "../Extra/Button_group"
const LowerMenuWrapper = ({ xyData, executeGeoglows, executeBiasCorrection,executeHydroWebData, setDataObject, isFullMap,isHydroDataOn, isGeoglowsActive}) => {

  return(
    
      <LowerMenu>
        <Button_group executeGeoglows = {executeGeoglows} executeBiasCorrection={executeBiasCorrection} executeHydroWebData={executeHydroWebData} isFullMap={isFullMap} />
        <LineXYChartWrapper xyData={xyData} setDataObject={setDataObject} isHydroDataOn={isHydroDataOn} isGeoglowsActive={isGeoglowsActive} />
        {/* <LineXYChartWrapper xyData={xyData} xyMin= { xyMin } xyMax={ xyMax } /> */}

      </LowerMenu>


  );
};

export default LowerMenuWrapper;