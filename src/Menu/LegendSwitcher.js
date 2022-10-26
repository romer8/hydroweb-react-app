import React from "react";
import { LegendSwitcher } from "../styles/LegendSwitcher.styled";
const LegendSwitcherWrapper = ({ xyData, isHydroDataOn, isGeoglowsActive, isBiasCorrectionOn, isForecastOn, legendToggle,setLegendToggle}) => {
    const legendGlyphSize = 15;
    
    const toggleOffOn = (e)=>{
        console.log(e)
        // e.preventDefault();
        const dataKey = e.target.value
        setLegendToggle(legendToggle => ({...legendToggle, [`${dataKey}`]: !legendToggle[`${dataKey}`]}))
        console.log(legendToggle)
        e.target.value = !legendToggle[`${dataKey}`]
        if(dataKey=='Water Level Maximun-Minimun'){
            setLegendToggle(legendToggle => ({...legendToggle, [`Water Level Minimun`]: !legendToggle[`Water Level Minimun`]}))
        }
        if(dataKey=='Forecast 25-75 Percentile StreamFlow'){
            setLegendToggle(legendToggle => ({...legendToggle, [`Forecast 25 Percentile StreamFlow`]: !legendToggle[`Forecast 25 Percentile StreamFlow`]}))
        }
        // console.log(dataKey)

    }
  return(
    
      <LegendSwitcher>
        {xyData.map((item,index)=>{
                if(isHydroDataOn && item['dataKey'].startsWith('Water Level')) {
                    if(item['dataKey'] == 'Water Level Minimun'){
                        return(
                            <div key={item['dataKey']} className="hiddenElement">
                                {/* <input value={item.dataKey} type="checkbox" onClick={toggleOffOn(item.dataKey)} /> */}
                                <input value={item.dataKey} type="checkbox"  checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                                <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_} width={legendGlyphSize} height={legendGlyphSize} />
                                </svg>
                                <span className="legendText">{item.dataKey}</span>
                            </div>
                        )
                    }
                    else{
                        return(
                            <div key={item['dataKey']}>
                                {/* <input value={item.dataKey} type="checkbox" onClick={toggleOffOn(item.dataKey)} /> */}
                                <input value={item.dataKey} type="checkbox"  checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                                <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_} width={legendGlyphSize} height={legendGlyphSize} />
                                </svg>
                                <span className="legendText">{item.dataKey}</span>
                            </div>
                        )
                    }

                }
                if(isGeoglowsActive && item['dataKey'] === "Historical Simulation"){
                    return(
                        <div key={item['dataKey']}>
                            <input value={item.dataKey} type="checkbox"  checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                            <svg width={legendGlyphSize} height={legendGlyphSize}>
                                <rect fill={item.color_} width={legendGlyphSize} height={legendGlyphSize}  opacity="0.5" />
                            </svg>
                            <span className="legendText">{item.dataKey}</span>
                        </div>
                    )
                }
                if(isBiasCorrectionOn && item['dataKey'].startsWith('Bias Corrected')){
                    return(
                        <div key={item['dataKey']}>
                            <input value={item.dataKey} type="checkbox"  checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                            <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_} width={legendGlyphSize} height={legendGlyphSize} />
                            </svg>
                            <span className="legendText">{item.dataKey}</span>
                        </div>
                    )
                }
                if(isForecastOn && item['dataKey'].includes('Forecast')){
                    if(item['dataKey'] == 'Forecast 25 Percentile StreamFlow'){
                        return(
                            <div key={item['dataKey']} className="">
                                <input value={item.dataKey} type="checkbox"  checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                                <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_} width={legendGlyphSize} height={legendGlyphSize} />
                                </svg>
                                <span className="legendText">{item.dataKey}</span>
                            </div>
                        )
                    }
                    else{
                        return(
                            <div key={item['dataKey']}>
                                <input value={item.dataKey} type="checkbox"  checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                                <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_} width={legendGlyphSize} height={legendGlyphSize} />
                                </svg>
                                <span className="legendText">{item.dataKey}</span>
                            </div>
                        )
                    }

                }
            }
        )
        }
      </LegendSwitcher>


  );
};

export default LegendSwitcherWrapper;