import React from "react";
import { LowerMenu } from "../styles/LowerMenu.styled";
import { LineXYChartWrapper } from "../Charts";
const LowerMenuWrapper = ({ xyData }) => {

  return(
    
      <LowerMenu>
        <LineXYChartWrapper xyData={xyData} />
      </LowerMenu>


  );
};

export default LowerMenuWrapper;