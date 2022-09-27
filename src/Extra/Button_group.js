import React from "react";
import {ButtonGroup} from '../styles/Button_group.styled'

const Button_group = ({ executeGeoglows, executeBiasCorrection, isFullMap }) => {



  return(
    
      <ButtonGroup isFullMap={isFullMap}>
        <div className="multi-button">
            <button id="hydroweb_data"> <span>1</span> Hydroweb Data</button>

            <button onClick={executeGeoglows} id="historical_simulation"><span>2</span> Historical Simulation Data</button>
            <button onClick={executeBiasCorrection} id="bias_correction"><span>3</span> Execute Bias Correction</button>
            <button id="data_download"><span>4</span> Download Data</button>
        </div>
      </ButtonGroup>


  );
};

export default Button_group;