import React from "react";
import {ButtonGroup} from '../styles/Button_group.styled'

const Button_group = ({ executeGeoglows, isFullMap }) => {



  return(
    
      <ButtonGroup isFullMap={isFullMap}>
        <div className="multi-button">
            <button onClick={executeGeoglows}> <span>1</span> Historical Simulation Data</button>
            <button><span>2</span> Execute Bias Correction</button>
            <button><span>3</span> Download Data</button>
        </div>
      </ButtonGroup>


  );
};

export default Button_group;