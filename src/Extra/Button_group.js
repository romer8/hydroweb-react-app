import React from "react";
import {ButtonGroup} from '../styles/Button_group.styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons'

const Button_group = ({ executeGeoglows, executeBiasCorrection,executeHydroWebData,executeForecast, isFullMap, isSuccessfulHydroWeb,isSuccessfulHistoricalSimulation,isSuccessfulHistoricalBiasCorrection,isSuccessfulForecastBiasCorrection }) => {
  // const setIsHydroDataOnHandler = ()=>{
  //   setIsHydroDataOn(true)
  // }


  return(
    
      <ButtonGroup 
        isFullMap={isFullMap}
        isSuccessfulHydroWeb={isSuccessfulHydroWeb}
        isSuccessfulHistoricalSimulation = {isSuccessfulHistoricalSimulation}
        isSuccessfulHistoricalBiasCorrection = {isSuccessfulHistoricalBiasCorrection}
        isSuccessfulForecastBiasCorrection = {isSuccessfulForecastBiasCorrection}
      >
        <div className="multi-button">
            <button onClick={executeHydroWebData} id="hydroweb_data"> 
              <span className="numberCircle">1</span> 
              <span>Hydroweb Data</span>
              <FontAwesomeIcon icon={faCircleCheck} id="check_hydroweb" /> 
            </button>
            <button onClick={executeGeoglows} id="historical_simulation">
              <span className="numberCircle">2</span> 
              GEOGloWS Historical Simulation Data
              <FontAwesomeIcon icon={faCircleCheck}  id="check_historical_sim"  />
            </button>
            <button onClick={executeBiasCorrection} id="bias_correction">
              <span className="numberCircle">3</span> 
              Water Level GEOGloWS Bias Correction 
              <FontAwesomeIcon icon={faCircleCheck} id="check_historical_bias"  />
            </button>
            <button onClick={executeForecast} id="forecast_extrapolation">
              <span className="numberCircle">4</span> 
              GEOGloWS Water Level Forecast 
              <FontAwesomeIcon icon={faCircleCheck} id="check_forecast_bias" />
            </button>
        </div>
      </ButtonGroup>


  );
};

export default Button_group;