import React from "react";
import {ButtonGroup} from '../styles/Button_group.styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons'

const Button_group = ({ executeGeoglows, executeBiasCorrection,executeHydroWebData,executeForecast, isFullMap }) => {
  // const setIsHydroDataOnHandler = ()=>{
  //   setIsHydroDataOn(true)
  // }


  return(
    
      <ButtonGroup isFullMap={isFullMap}>
        <div className="multi-button">
            <button onClick={executeHydroWebData} id="hydroweb_data"> <span className="numberCircle">1</span> Obtain Hydroweb Data <FontAwesomeIcon icon={faCircleCheck} /> </button>
            <button onClick={executeGeoglows} id="historical_simulation"><span className="numberCircle">2</span> GEOGloWS Historical Simulation Data<FontAwesomeIcon icon={faCircleCheck} /></button>
            <button onClick={executeBiasCorrection} id="bias_correction"><span className="numberCircle">3</span> Execute GEOGloWS Bias Correction <FontAwesomeIcon icon={faCircleCheck} /></button>
            <button onClick={executeForecast} id="forecast_extrapolation"><span className="numberCircle">4</span> Extrapolate GEOGloWS Forecast <FontAwesomeIcon icon={faCircleCheck} /></button>
            {/* <button id="data_download"><span>5</span> Download Data</button> */}
        </div>
      </ButtonGroup>


  );
};

export default Button_group;