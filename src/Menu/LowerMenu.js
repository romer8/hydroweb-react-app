import React from "react";
import { LowerMenu } from "../styles/LowerMenu.styled";
import { LineXYChartWrapper } from "../Charts";
const LowerMenuWrapper = ({ xyData, xyMin, xyMax }) => {

  return(
    
      <LowerMenu>
        <LineXYChartWrapper xyData={xyData} xyMin= { xyMin } xyMax={ xyMax } />
      </LowerMenu>


  );
};

export default LowerMenuWrapper;