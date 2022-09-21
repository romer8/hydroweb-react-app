import React from "react";
import { LowerMenu } from "../styles/LowerMenu.styled";
import { LineXYChartWrapper } from "../Charts";
import Button_group from "../Extra/Button_group"
const LowerMenuWrapper = ({ xyData, xyMin, xyMax, executeGeoglows, isFullMap }) => {

  return(
    
      <LowerMenu>
        <Button_group executeGeoglows = {executeGeoglows} isFullMap={isFullMap} />
        <LineXYChartWrapper xyData={xyData} xyMin= { xyMin } xyMax={ xyMax } />
      </LowerMenu>


  );
};

export default LowerMenuWrapper;