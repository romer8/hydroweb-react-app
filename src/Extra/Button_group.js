import React from "react";
import {ButtonGroup} from '../styles/Button_group.styled'

const Button_group = ({ executeGeoglows, executeBiasCorrection,executeHydroWebData, isFullMap }) => {
  // const setIsHydroDataOnHandler = ()=>{
  //   setIsHydroDataOn(true)
  // }


  return(
    
      <ButtonGroup isFullMap={isFullMap}>
        <div className="multi-button">
            <button onClick={executeHydroWebData} id="hydroweb_data"> <span>1</span> Obtain Hydroweb Data</button>
            <button onClick={executeGeoglows} id="historical_simulation"><span>2</span> GEOGloWS Historical Simulation Data</button>
            <button onClick={executeBiasCorrection} id="bias_correction"><span>3</span> Execute GEOGloWS Bias Correction</button>
            <button onClick={executeBiasCorrection} id="forecast_extrapolation"><span>4</span> Extrapolate GEOGloWS Forecast </button>

            <button id="data_download"><span>5</span> Download Data</button>
        </div>
      </ButtonGroup>


  );
};

export default Button_group;