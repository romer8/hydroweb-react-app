import { format } from "date-fns";
import {
  Axis,
  Grid,
  LineSeries,
  AnimatedLineSeries,
  AreaSeries,
  AnimatedAreaSeries,
  Tooltip,
  defaultStyles,
  XYChart,
  DataContext,
  DataProvider,
  darkTheme as dt,
  buildChartTheme
} from "@visx/xychart";



import { ThemeConfig } from '@visx/xychart/lib/theme/buildChartTheme'

import { PatternLines } from "@visx/pattern";
import { LegendOrdinal, LegendItem,LegendLabel } from "@visx/legend";

import { curveCardinal } from '@visx/curve';

import { ParentSize } from '@visx/responsive';

import { ChartContainer } from "../styles/ChartContainer.styled";
import { useState, useContext, useMemo, React } from "react";

const tickLabelOffset = 10;

const accessors_val = {
  xAccessor: (d) => new Date(`${d.date}T00:00:00`),
  yAccessor: (d) => d.orthometric_height_of_water_surface_at_reference_position
};

const accessors_max = {
  xAccessor: (d) => new Date(`${d.date}T00:00:00`),
  yAccessor: (d) => d.up_uncertainty,
  x0Accessor: (d) => new Date(`${d.date}T00:00:00`),
  y0Accessor: (d) => d.orthometric_height_of_water_surface_at_reference_position

};
const accessors_min = {
  xAccessor: (d) => new Date(`${d.date}T00:00:00`),
  yAccessor: (d) => d.orthometric_height_of_water_surface_at_reference_position,
  x0Accessor: (d) => new Date(`${d.date}T00:00:00`),
  y0Accessor: (d) => d.down_uncertainty
}

const accessors_fin = {
  xAccessor: {
    val: (d) => new Date(`${d.date}T00:00:00`),
    max: (d) => new Date(`${d.date}T00:00:00`),
    min: (d) => new Date(`${d.date}T00:00:00`),
  },
  yAccessor:{
    val: (d) => Math.round(d.orthometric_height_of_water_surface_at_reference_position*100)/100,
    max: (d) => Math.round(d.up_uncertainty*100)/100,
    min: (d) => Math.round(d.orthometric_height_of_water_surface_at_reference_position*100)/100,
  },
  x0Accessor:{
    // val: (d) => (d) => new Date(`${d.date}T00:00:00`),
    max: (d) => new Date(`${d.date}T00:00:00`),
    min: (d) => new Date(`${d.date}T00:00:00`),
  },
  y0Accessor:{
    // val: (d) => (d) => new Date(`${d.date}T00:00:00`),
    max: (d) => Math.round(d.orthometric_height_of_water_surface_at_reference_position*100)/100,
    min: (d) => Math.round(d.down_uncertainty*100)/100
  }
}

// const normal_accesors_date = {
//   xAccessor: (d) => new Date(`${d.x}T00:00:00`),
//   yAccessor: (d) => d.y
// }
const colorScaleCasero = (xyData,tooltipData) =>{
  const colorselected = xyData.filter(item => item.dataKey === tooltipData.nearestDatum.key)[0]['color_fill']
  return colorselected
}

// const color_fillaccessor_t = (d) => xyData[d]['color_fill']
const darkTheme = buildChartTheme({
  ...dt,
  colors: ['#2B4865','#8FE3CF','#8FE3CF'],
})

const customTheme = buildChartTheme({
  ...dt,
  colors: ['#2B4865','#8FE3CF','#8FE3CF'],
  backgroundColor: "#9a336a",
})


const accesor_tooltip = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y,
  y0Accessor:(d) => d.y0 ? d.yo : ""
}
const normal_accesors = {
  xAccessor: (d) => !d?.x.includes(":") ? new Date(`${d?.x}T00:00:00`) : new Date(`${d?.x.replace(' ','T')}`),
  yAccessor: (d) => d.y
}
const normal_accesors_area = {
  xAccessor: (d) => !d?.x.includes(":") ? new Date(`${d?.x}T00:00:00`) : new Date(`${d?.x.replace(' ','T')}`),
  yAccessor: (d) => d.y,
  y0Accessor:(d) => d.y0
}

const legendGlyphSize = 15;

const ChartBackground = ( patternId ) => {
  const { theme, width, height, margin, innerHeight, innerWidth } = useContext(
    DataContext
  );
  return (
    <>
      <PatternLines
        id={patternId}
        width={16}
        height={16}
        orientation={["diagonal"]}
        stroke={theme?.gridStyles?.stroke}
        strokeWidth={1}
      />
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={theme?.backgroundColor ?? "#fff"}
      />
      <rect
        x={margin.left}
        y={margin.top}
        width={innerWidth}
        height={innerHeight}
        fill={`url(#${patternId})`}
        fillOpacity={0.3}
      />
    </>
  );
};



function pad2(n) { return n < 10 ? '0' + n : n }



// const LineXYChartWrapper = ({ xyData, xyMin, xyMax }) => {
const LineXYChartWrapper = ({ xyData, setDataObject, isHydroDataOn, isGeoglowsActive, isBiasCorrectionOn,isForecastOn, legendToggle }) => {
  const [backupData, setBackupData] = useState([]);

  const loopThroughData = (xyData,isHydroDataOn, isGeoglowsActive, isBiasCorrectionOn,isForecastOn, legendToggle) =>{
    return (
        xyData?.map(function(lineData) {
          // console.log(lineData)isHydroDataOn && item['dataKey'].startsWith('Water Level')
          if(isHydroDataOn && lineData['dataKey'].startsWith('Water Level') && legendToggle[`${lineData['dataKey']}`]){
            // console.log("Hydroweb Data",isHydroDataOn)
            if(!lineData['dataKey'].includes('-')){
              console.log(lineData['dataKey'],legendToggle[`${lineData['dataKey']}`])
              return (
                  
                    <AnimatedLineSeries
                    key={lineData['dataKey']}
                    stroke={lineData['color_fill']}
                    dataKey={lineData['dataKey']}
                    data={lineData['data']}
                    {...normal_accesors}
                    curve={curveCardinal}
                    colorAccessor ={(_)=>lineData['color_fill']}
                  />              

                

             );
            }
            else{
      
              return (
                  <AnimatedAreaSeries
                    key={lineData['dataKey']}
                    dataKey={lineData['dataKey']}
                    data={lineData['data']}
                    {...normal_accesors_area}
                    curve={curveCardinal}
                    fill={lineData['color_fill']}
                    stroke={lineData['color_fill']}
                    fillOpacity={0.3}
                    strokeOpacity={0.3}
                  />
     
             );
            }
      
        
          }
          if(isGeoglowsActive && lineData['dataKey'] == "Historical Simulation"){
            console.log("Historical Simulation",isGeoglowsActive)
            return (
              legendToggle[`${lineData['dataKey']}`] &&
              <LineSeries
                key={lineData['dataKey']}
                dataKey={lineData['dataKey']}
                data={lineData['data']}
                {...normal_accesors}
                colorAccessor ={(_)=>lineData['color_fill']}
                curve={curveCardinal}
                stroke={lineData['color_fill']}
            />
            );
          }
          if(isBiasCorrectionOn && lineData['dataKey'].startsWith('Bias Corrected')){
            console.log("Hydroweb Bias Corrected",isBiasCorrectionOn)
            if(lineData['dataKey'].includes('Mean')){
              return (
                legendToggle[`${lineData['dataKey']}`] &&
      
                <LineSeries
                  key={lineData['dataKey']}
                  // stroke={lineData['stroke']}
                  dataKey={lineData['dataKey']}
                  data={lineData['data']}
                  {...normal_accesors}
                  curve={curveCardinal}
                  colorAccessor ={(_)=>lineData['color_fill']}
              />
              );
            }
            else{
              return (
                legendToggle[`${lineData['dataKey']}`] &&
      
                <LineSeries
                  key={lineData['dataKey']}
                  // stroke={lineData['stroke']}
                  dataKey={lineData['dataKey']}
                  data={lineData['data']}
                  {...normal_accesors}
                  curve={curveCardinal}
                  colorAccessor ={(_)=>lineData['color_fill']}
                  strokeOpacity={0.5}
      
              />
              );
            }
      
          }
          if(isForecastOn && lineData['dataKey'].includes('Forecast')){
            console.log("Hydroweb Forecast Bias Corrected",isForecastOn)
            // console.log(lineData['dataKey'])
            // console.log(lineData['data'])
            if(lineData['dataKey'].includes('-')){
              console.log(lineData['color_fill'])
              return (
      
                legendToggle[`${lineData['dataKey']}`] &&
      
                <AnimatedAreaSeries
                  key={lineData['dataKey']}
                  stroke={lineData['color_fill']}
                  dataKey={lineData['dataKey']}
                  data={lineData['data']}
                  {...normal_accesors_area}
                  curve={curveCardinal}
                  fillOpacity={0.3}
                  strokeOpacity={0.3}
                  fill={lineData['color_fill']}
      
              />
              );
            }
            else{
      
              return (
      
                legendToggle[`${lineData['dataKey']}`] &&
      
                <AnimatedLineSeries
                  key={lineData['dataKey']}
                  stroke={lineData['color_fill']}
                  dataKey={lineData['dataKey']}
                  data={lineData['data']}
                  {...normal_accesors}
                  curve={curveCardinal}
                  colorAccessor ={(_)=>lineData['color_fill']}
                  // strokeOpacity={0.3}
      
              />
              );
            }
      
          }
      
        })
      
    )

  }
  const getData = useMemo(() =>loopThroughData(xyData,isHydroDataOn, isGeoglowsActive, isBiasCorrectionOn,isForecastOn, legendToggle), [xyData,isHydroDataOn, isGeoglowsActive, isBiasCorrectionOn,isForecastOn,legendToggle] )


  

  const legendLabelStyle = (margin) => {
   return {    
      position: 'absolute',
      top: margin.top * 2,
      left: 0,
      right: 0,
      marginLeft: 'auto',
      // marginRight: 'auto',  
      width: 'fit-content',
      height: 'fit-content',
      display: 'flex',
      flexDirection:"column",
      padding:'5px',
      // justifyContent: 'center',
      // alignItems:'center',
      fontSize: '10px',
      color:'white',
      fontFamily: 'arial',
      fontWeight: 900,
      backgroundColor: 'rgba(0,0,0,.5)',
      borderRadius: '2px',
      overflowY: 'auto',
      flexGrow: 1
    }
  }
  const OffLegend = (label) =>{

    //// setDataObject(xyData.filter(item => item.dataKey !== label.text))
    
    // setDataObject(xyData.filter(item => {
    //   if(item.dataKey == label.text){
    //       if(backupData.filter(item2 => item2.dataKey == label.text).length < 1){
    //         console.log("hidding")
    //         setBackupData(backupData => [...backupData, {
    //           dataKey: item.dataKey,
    //           data: item.data
    //         }]);
    //        item.data = []
    //        console.log(backupData)
    //       }
    //       else{
    //         console.log("showing")
    //         console.log(backupData)

    //         // console.log(backupData.filter(item => item.dataKey == label.text)[0]['data'])
    //         item.data = backupData.filter(item => item.dataKey == label.text)[0]['data']

    //         setBackupData(backupData.filter(item => item.dataKey !== label.text))
    //         console.log(backupData)
    //       }

    //   }
    //   return item
    // }))
    
  }
  
  const ChartLegend = () => {
    const { colorScale, theme, margin } = useContext(DataContext);
    
    return (

      <LegendOrdinal
        direction="column"
        // itemMargin="8px 8px 8px 0"
        scale={colorScale}
        // labelFormat={(label) => label.replace("-", " ")}
        // legendLabelProps={{ color: "black" }}
        //style={{ display: 'flex', flexDirection: 'row' }}
        // shape="line"
        // labelMargin="0 15px 0 0"
        >
            {(labels) => (
              <div       
              style={legendLabelStyle(margin)}
              >
                {labels.map((label, i) => (
                  // {console.log(i)}
                  <div>
                  <LegendItem
                    key={`legend-${i}`}
                    margin="8px 8px 8px 0"
                    onClick={() => {
                      console.log(DataContext);
                      console.log(i)
                      // OffLegend(label);

                    }}
                    style={{
                      'paddingLeft':'3px',
                      'textDecoration': backupData.filter(item2 => item2.dataKey == label.text).length < 1 ? 'none' : 'line-through',
                      'display': 'flex'
                    }}
                  >
                    <svg width={legendGlyphSize} height={legendGlyphSize}>
                      <rect fill={label.value} width={legendGlyphSize} height={legendGlyphSize} />
                    </svg>
                    <LegendLabel align="left" margin="0 15px 0 0" >
                      {label.text}
                    </LegendLabel>
                  </LegendItem>

                  </div>

                ))}
              </div>
            )}
  
        </LegendOrdinal>
  
        // style={{
        //   backgroundColor: theme.backgroundColor,
        //   marginTop: -5,
        //   paddingLeft: margin.left,
        //   color: 'black',
        //   display: 'flex',
        //   float: 'left' ,// required in addition to `direction` if overriding styles
        //   width:'fit-content'
        // }}
      // />
    );
  };

  return (

        <ChartContainer>
          <DataProvider
            // these props have been moved from XYChart to DataProvider
            // this allows us to move DataContext up a level such that we can
            // render an HTML legend that uses DataContext and an SVG chart
            // without doing this you would have to render XYChart as a child
            // of XYChart, which would then require the legend to be SVG-based
            // because HTML cannot be a child of SVG
            xScale={{ 
              type: "utc",
              zero: false,

              // domain: [minDateXScale, maxDateXScale]

            }}
            yScale={{ 
              type: "linear", 
              zero: false,
              // domain: [10, 50]
            }}
            theme={customTheme}
            
            >
          <ParentSize>
          {
            
            parent =>(
              
              <XYChart
              // parentWidth={parent.width}
              // parentHeight={parent.height}
              // parentTop={parent.top}
              // parentLeft={parent.left}
              // //this is the referer to the wrapper component
              // parentRef={parent.ref}
              // this function can be called inside MySuperCoolVisxChart to cause a resize of the wrapper component
              // resizeParent={parent.resize}
              width={parent.width}
              height={parent.height}
              margin={{ left: 60, top: 35, bottom: 38, right: 27 }}
              ignoreDimensions={["width"]}
              
            >
        
              <Grid
                columns={true}
                numTicks={4}
                lineStyle={{
                  stroke: "#e1e1e1",
                  strokeLinecap: "round",
                  strokeWidth: 2
                }}
                strokeDasharray="0, 4"
              />
              <Axis
                hideAxisLine={true}
                hideTicks={false}
                orientation="bottom"
                tickLabelProps={() => ({ dy: tickLabelOffset })}
                left={30}
                numTicks={4}
                // label="Time (year)"
                labelOffset={20}
        
              />
              <Axis
                hideAxisLine={false}
                hideTicks={false}
                orientation="left"
                numTicks={4}
                label="Water Level (m)"
                labelOffset={30}
                tickLabelProps={() => ({ dy: -10 })}
              />
              {getData}
        
        
            <Tooltip

                    showVerticalCrosshair
                    snapTooltipToDatumX
                    // showSeriesGlyphs
                    glyphStyle={{
                      fill: "#008561",
                      strokeWidth: 0
                    }}
                    renderTooltip={({ tooltipData, colorScale }) =>

                      tooltipData.nearestDatum.key && (
                        <>
                          {

                            accesor_tooltip.xAccessor(tooltipData.nearestDatum.datum)
                          }
                          <br/>
                          <br/>

                          {
                            (Object.keys(tooltipData?.datumByKey).filter((serieline)=>serieline).map((serieline)=>{
                              const dataval =
                                tooltipData?.nearestDatum?.datum &&
                                normal_accesors['yAccessor'](
                                  tooltipData.datumByKey[serieline].datum
                                )?.toFixed(2);

                              const colorDatum =  tooltipData?.nearestDatum?.datum && xyData.filter(item => item.dataKey === tooltipData.datumByKey[serieline].key)[0]['color_fill'] ? xyData.filter(item => item.dataKey === tooltipData.datumByKey[serieline].key)[0]['color_fill'] : ""
                              if(!serieline.includes('-')){
                                return(

                                  <div key={serieline}>
                                    <em style={{ 
                                    color: colorDatum,
                                     textDecoration:
                                        tooltipData?.nearestDatum?.key === serieline ? 'underline' : undefined,
                                     }} >
                                      {serieline}
                                    </em>
                                    {'  '}
                                      {`${dataval} m`}
                                  </div>
  
                                )
                              }

                            
                            })
                            )
                          
                          }
                        </>
                      )
                    
   
                    }
                  />
        
        
            </XYChart>
            )
          }

        </ParentSize>
        {/* <ChartLegend /> */}
        </DataProvider>
        </ChartContainer>


    // )}
  // </ParentSize>


  );
};

export default LineXYChartWrapper;

                          // {/* <div style={{ color: colorScaleCasero(xyData,tooltipData) }}>
                          //   {tooltipData.nearestDatum.key}
                          // </div> */}
                          
                          // {
                          //   // (d) => new Date(`${d.x}T00:00:00`)
                          //   // (d) => !d.x.includes(":") ? new Date(`${d.x}T00:00:00`) : new Date(`${d.x.replace(' ','T')}`)

                          //   accesor_tooltip.xAccessor(tooltipData.nearestDatum.datum)
                          // }

  // const [minDateXScale, setMinDateXScale] = useState("");
  // const [maxDateXScale, setMaxDateXScale] = useState("");

  
  // useEffect(() => {
  //   console.log("useEffect XYCHART")
  //   //we only need to do this for forecast if it is on
  //   if(isForecastOn){
  //     var result = xyData.filter(function(serie_line_or_area) {
  //       if(serie_line_or_area.dataKey.includes('Forecast') && legendToggle[serie_line_or_area.dataKey] ){
  //         // console.log("hey")
  //         return serie_line_or_area;
  //       }
  //     });
  //     // get the minimun//
  //     console.log(result)
  //     var minimun_dates_array = []

  //     var minimun_dates = result.filter(function(single_result){
  //       const minDate = new Date(
  //         Math.min(
  //           ...single_result['data'].map(element => {
                      
  //             let [y,M,d,h,m,s] = element.x.split(/[- :]/);
  //             let newDate =  new Date(y,parseInt(M)-1,d,h,parseInt(m),s);
  //             return new Date(newDate);
  //           }),
  //         ),
  //       );
  //       // console.log(new Date())
  //       var new_min_date_format = minDate.getFullYear().toString()+ "-" + pad2(minDate.getMonth() + 1) + "-" + pad2(minDate.getDate()) +" "+ pad2( minDate.getHours() ) +":"+ pad2( minDate.getMinutes() ) + ":"+ pad2( minDate.getSeconds() )
  //       minimun_dates_array.push(new_min_date_format)

  //       return minDate
  //     })
  //       const minDate_final = new Date(

  //         Math.min(
  //           ...minimun_dates_array.map(element => {
                      
  //             let [y,M,d,h,m,s] = element.split(/[- :]/);
  //             let newDate =  new Date(y,parseInt(M)-1,d,h,parseInt(m),s);
  //             return new Date(newDate);
  //           }),
  //         ),
  //       );
  //       var new_min_date_final_string = minDate_final.getFullYear().toString()+ "-" + pad2(minDate_final.getMonth() + 1) + "-" + pad2(minDate_final.getDate()) +" "+ pad2( minDate_final.getHours() ) +":"+ pad2( minDate_final.getMinutes() ) + ":"+ pad2(minDate_final.getSeconds() )
  //       setMinDateXScale(new_min_date_final_string)

  //     // get the maximun//
  //     var maximun_dates_array = []

  //     var maximun_dates = result.filter(function(single_result){
  //       const maxDate = new Date(
  //         Math.max(
  //           ...single_result['data'].map(element => {
                      
  //             let [y,M,d,h,m,s] = element.x.split(/[- :]/);
  //             let newDate =  new Date(y,parseInt(M)-1,d,h,parseInt(m),s);
  //             return new Date(newDate);
  //           }),
  //         ),
  //       );
  //       // console.log(new Date())
  //       var new_max_date_format = maxDate.getFullYear().toString()+ "-" + pad2(maxDate.getMonth() + 1) + "-" + pad2(maxDate.getDate()) +" "+ pad2( maxDate.getHours() ) +":"+ pad2( maxDate.getMinutes() ) + ":"+ pad2( maxDate.getSeconds() )
  //       maximun_dates_array.push(new_max_date_format)

  //       return maxDate
  //     })
  //       const maxDate_final = new Date(

  //         Math.max(
  //           ...maximun_dates_array.map(element => {
                      
  //             let [y,M,d,h,m,s] = element.split(/[- :]/);
  //             let newDate =  new Date(y,parseInt(M)-1,d,h,parseInt(m),s);
  //             return new Date(newDate);
  //           }),
  //         ),
  //       );
  //       var new_max_date_final_string = maxDate_final.getFullYear().toString()+ "-" + pad2(maxDate_final.getMonth() + 1) + "-" + pad2(maxDate_final.getDate()) +" "+ pad2( maxDate_final.getHours() ) +":"+ pad2( maxDate_final.getMinutes() ) + ":"+ pad2(maxDate_final.getSeconds() )
  //       setMaxDateXScale(new_max_date_final_string)
  //       console.log(minDateXScale, maxDateXScale)
  //       console.log(new_min_date_final_string, new_max_date_final_string)

  //   }

  //   return () => {

  //   }
  // }, [legendToggle])