import React from "react";
import { LegendSwitcher } from "../styles/LegendSwitcher.styled";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleDown } from '@fortawesome/free-regular-svg-icons'


const LegendSwitcherWrapper = ({ xyData, isHydroDataOn, isGeoglowsActive, isBiasCorrectionOn, isForecastOn, legendToggle,setLegendToggle}) => {
    const legendGlyphSize = 15;
    
    const toggleOffOn = (e)=>{
        console.log("hey")
        // e.preventDefault();
        const dataKey = e.target.value
        setLegendToggle(legendToggle => ({...legendToggle, [`${dataKey}`]: !legendToggle[`${dataKey}`]}))
        console.log(legendToggle)
        e.target.value = !legendToggle[`${dataKey}`]
        if(dataKey=='Water Level Maximun-Minimun'){
            console.log("hey2")

            setLegendToggle(legendToggle => ({...legendToggle, [`Water Level Minimun`]: !legendToggle[`Water Level Minimun`]}))
            setLegendToggle(legendToggle => ({...legendToggle, [`Water Level Maximun`]: !legendToggle[`Water Level Maximun`]}))

        }
        if(dataKey=='Forecast 25-75 Percentile StreamFlow'){
            setLegendToggle(legendToggle => ({...legendToggle, [`Forecast 25 Percentile StreamFlow`]: !legendToggle[`Forecast 25 Percentile StreamFlow`]}))
            setLegendToggle(legendToggle => ({...legendToggle, [`Forecast 75 Percentile StreamFlow`]: !legendToggle[`Forecast 75 Percentile StreamFlow`]}))
        
        }
        if(dataKey=='Forecast Minimun-Maximun StreamFlow'){
            setLegendToggle(legendToggle => ({...legendToggle, [`Forecast Minimun StreamFlow`]: !legendToggle[`Forecast Minimun StreamFlow`]}))
            setLegendToggle(legendToggle => ({...legendToggle, [`Forecast Maximun StreamFlow`]: !legendToggle[`Forecast Maximun StreamFlow`]}))
        }
        if(dataKey=='1st Days Forecasts Maximum-Minimum Records'){
            setLegendToggle(legendToggle => ({...legendToggle, [`1st Days Forecasts Maximun Records`]: !legendToggle[`1st Days Forecasts Maximun Records`]}))
            setLegendToggle(legendToggle => ({...legendToggle, [`1st Days Forecasts Minimum Records`]: !legendToggle[`1st Days Forecasts Minimum Records`]}))         
        }
        if(dataKey=='High Resolution Minimum-Maximum Forecast Records (1st Days Forecasts Records)'){
            setLegendToggle(legendToggle => ({...legendToggle, [`High Resolution Minimum (1st Days Forecasts Records)`]: !legendToggle[`High Resolution Minimum (1st Days Forecasts Records)`]}))
            setLegendToggle(legendToggle => ({...legendToggle, [`High Resolution Maximum (1st Days Forecasts Records)`]: !legendToggle[`High Resolution Maximum (1st Days Forecasts Records)`]}))         
        }

    }
  return(
    
      <LegendSwitcher>
        {xyData.map((item,index)=>{
                console.log(xyData);
                if(isHydroDataOn && item['dataKey'].startsWith('Water Level')) {
                    if(item['dataKey'] == 'Water Level Minimun' || item['dataKey'] == 'Water Level Maximun'){
                        return(
                            <div key={item['dataKey']} className="hiddenElement">
                                {/* <input value={item.dataKey} type="checkbox" onClick={toggleOffOn(item.dataKey)} /> */}
                                <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_fill} width={legendGlyphSize} height={legendGlyphSize} />
                                </svg>
                                <span className="legendText">{item.dataKey}</span>
                                <input value={item.dataKey} type="checkbox"  className="cm-toggle" checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                                <button className="iconColorLegend" onclick="iconColorLegend">
                                    <FontAwesomeIcon icon={faCircleDown} />
                                </button>
                            </div>
                        )
                    }
                    else{
                        return(
                            <div key={item['dataKey']}>
                                {/* <input value={item.dataKey} type="checkbox" onClick={toggleOffOn(item.dataKey)} /> */}
                                <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_fill} width={legendGlyphSize} height={legendGlyphSize} />
                                </svg>
                                <span className="legendText">{item.dataKey}</span>
                                <input value={item.dataKey} type="checkbox"  className="cm-toggle" checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                                <button className="iconColorLegend" onclick="">
                                    <FontAwesomeIcon icon={faCircleDown} />
                                </button>
                                
                            </div>
                        )
                    }

                }
                if(isGeoglowsActive && item['dataKey'] === "Historical Simulation"){
                    return(
                        <div key={item['dataKey']}>
                            <svg width={legendGlyphSize} height={legendGlyphSize}>
                                <rect fill={item.color_fill} width={legendGlyphSize} height={legendGlyphSize}  opacity="0.5" />
                            </svg>
                            <span className="legendText">{item.dataKey}</span>
                            <input value={item.dataKey} type="checkbox"  className="cm-toggle" checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                            <button className="iconColorLegend" onclick="">
                                <FontAwesomeIcon icon={faCircleDown} />
                            </button>
                        </div>
                    )
                }
                if(isBiasCorrectionOn && item['dataKey'].startsWith('Bias Corrected')){
                    return(
                        <div key={item['dataKey']}>
                            <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_fill} width={legendGlyphSize} height={legendGlyphSize} />
                            </svg>
                            <span className="legendText">{item.dataKey}</span>
                            <input value={item.dataKey} type="checkbox"  className="cm-toggle" checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                            <button className="iconColorLegend" onclick="">
                                <FontAwesomeIcon  icon={faCircleDown} />
                            </button>
                        </div>
                    )
                }
                if(isForecastOn && item['dataKey'].includes('Forecast')){
                    if(item['dataKey'] == 'Forecast 25 Percentile StreamFlow' || item['dataKey'] == 'Forecast 75 Percentile StreamFlow'){
                        return(
                            <div key={item['dataKey']} className="hiddenElement">
                                <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_fill} width={legendGlyphSize} height={legendGlyphSize} />
                                </svg>
                                <span className="legendText">{item.dataKey}</span>
                                <input value={item.dataKey} type="checkbox"  className="cm-toggle" checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                                <button className="iconColorLegend" onclick="">
                                    <FontAwesomeIcon icon={faCircleDown} />
                                </button>
                            </div>
                        )
                    }
                    else if (item['dataKey'] == 'Forecast Maximun StreamFlow' || item['dataKey'] == 'Forecast Minimun StreamFlow'){
                        return(
                            <div key={item['dataKey']} className="hiddenElement">
                                <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_fill} width={legendGlyphSize} height={legendGlyphSize} />
                                </svg>
                                <span className="legendText">{item.dataKey}</span>
                                <input value={item.dataKey} type="checkbox"  className="cm-toggle" checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                                <button className="iconColorLegend" onclick="">
                                    <FontAwesomeIcon icon={faCircleDown} />
                                </button>
                            </div>
                        )
                    }
                    else if (item['dataKey'] == '1st Days Forecasts Maximun Records' || item['dataKey'] == '1st Days Forecasts Minimun Records'){
                        return(
                            <div key={item['dataKey']} className="hiddenElement">
                                <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_fill} width={legendGlyphSize} height={legendGlyphSize} />
                                </svg>
                                <span className="legendText">{item.dataKey}</span>
                                <input value={item.dataKey} type="checkbox"  className="cm-toggle" checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                                <button className="iconColorLegend" onclick="">
                                    <FontAwesomeIcon icon={faCircleDown} />
                                </button>
                            </div>
                        )
                    }
                    else if (item['dataKey'] == 'High Resolution Maximum (1st Days Forecasts Records)' || item['dataKey'] == 'High Resolution Minimum (1st Days Forecasts Records)'){
                        return(
                            <div key={item['dataKey']} className="hiddenElement">
                                <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_fill} width={legendGlyphSize} height={legendGlyphSize} />
                                </svg>
                                <span className="legendText">{item.dataKey}</span>
                                <input value={item.dataKey} type="checkbox"  className="cm-toggle" checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                                <button className="iconColorLegend" onclick="">
                                    <FontAwesomeIcon icon={faCircleDown} />
                                </button>
                            </div>
                        )
                    }
                    else{
                        return(
                            <div key={item['dataKey']}>
                                <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect fill={item.color_fill} width={legendGlyphSize} height={legendGlyphSize} />
                                </svg>
                                <span className="legendText">{item.dataKey}</span>
                                <input value={item.dataKey} type="checkbox"  className="cm-toggle" checked={legendToggle[`${item.dataKey}`]} onChange={toggleOffOn}/>
                                <button className="iconColorLegend" onclick="">
                                <FontAwesomeIcon  icon={faCircleDown} />
                                </button>
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