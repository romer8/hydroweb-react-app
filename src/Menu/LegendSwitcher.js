import React from "react";
import { LegendSwitcher } from "../styles/LegendSwitcher.styled";
const LegendSwitcherWrapper = ({ xyData, isHydroDataOn, isGeoglowsActive, isBiasCorrectionOn, isForecastOn, legendToggle,setLegendToggle}) => {
    const toggleOffOn = (e)=>{
        console.log(e)
        // e.preventDefault();
        const dataKey = e.target.value
        console.log(dataKey)
        setLegendToggle(legendToggle => ({...legendToggle, [`${dataKey}`]: !legendToggle[`${dataKey}`]}))
        console.log(legendToggle)
        e.target.value = !legendToggle[`${dataKey}`]
    }
  return(
    
      <LegendSwitcher>
        {xyData.map((item,index)=>{
                if(isHydroDataOn && (item['dataKey'] !== "Historical Simulation" && !item['dataKey'].startsWith('Bias Corrected'))) {
                    return(
                        <div key={index}>
                            {/* <input value={item.dataKey} type="checkbox" onClick={toggleOffOn(item.dataKey)} /> */}
                            <input value={item.dataKey} type="checkbox"  checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                            <span>{item.dataKey}</span>
                        </div>
                    )
                }
                if(isGeoglowsActive && item['dataKey'] === "Historical Simulation"){
                    return(
                        <div key={index}>
                            <input value={item.dataKey} type="checkbox"  checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                            <span>{item.dataKey}</span>
                        </div>
                    )
                }
                if(isBiasCorrectionOn && item['dataKey'].startsWith('Bias Corrected')){
                    return(
                        <div key={index}>
                            <input value={item.dataKey} type="checkbox"  checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                            <span>{item.dataKey}</span>
                        </div>
                    )
                }
                if(isForecastOn && item['dataKey'].includes('Forecast')){
                    return(
                        <div key={index}>
                            <input value={item.dataKey} type="checkbox"  checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                            <span>{item.dataKey}</span>
                        </div>
                    )
                }
            }
        )
        }
      </LegendSwitcher>


  );
};

export default LegendSwitcherWrapper;