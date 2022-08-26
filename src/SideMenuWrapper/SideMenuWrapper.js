import React from "react";
import {SideMenu} from '../styles/SideMenu.styled'

const SideMenuWrapper = ({ onLayer,layer}) => {



  return(
    
      <SideMenu>
        <div className="wrapper_absolute">
        <p className="sudo_title">
          Legend
        </p>
        <div className="mycontainer">
          
        </div>
        <input
          type="checkbox"
          checked={layer}
          onChange={(event) => onLayer(event)}
          className="input_name"
        /> 
        <span>Virtual Stations</span>

        </div>        

      </SideMenu>


  );
};

export default SideMenuWrapper;