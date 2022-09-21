import React from "react";
import {ButtonGroup} from '../styles/Button_group.styled'

const Button_group = ({ executeGeoglows, isFullMap }) => {



  return(
    
      <ButtonGroup isFullMap={isFullMap}>
        <div className="multi-button">
            <button onClick={executeGeoglows}>Get Historical Simulation Data</button>
            <button>Execute Bias Correction</button>
            <button>Download Data</button>
        </div>
      </ButtonGroup>


  );
};

export default Button_group;