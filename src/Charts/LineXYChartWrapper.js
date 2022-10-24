import { format } from "date-fns";
import {
  Axis,
  Grid,
  LineSeries,
  AnimatedAreaSeries,
  Tooltip,
  XYChart,
  DataContext,
  DataProvider
} from "@visx/xychart";
import { PatternLines } from "@visx/pattern";
import { LegendOrdinal, LegendItem,LegendLabel } from "@visx/legend";

import { curveCardinal } from '@visx/curve';

import { ParentSize } from '@visx/responsive';

import { ChartContainer } from "../styles/ChartContainer.styled";
import { ColoredSquare } from "../styles/ColoredSquare.styled";
import { TooltipContainer } from "../styles/TooltipContainer.styled";
import { useState, useContext } from "react";

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

const normal_accesors = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y
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




// const LineXYChartWrapper = ({ xyData, xyMin, xyMax }) => {
const LineXYChartWrapper = ({ xyData, setDataObject, isHydroDataOn, isGeoglowsActive, isBiasCorrectionOn,isForecastOn, legendToggle }) => {
  const [backupData, setBackupData] = useState([]);
  const [showHistoricalData, setShowHistoricalData] = useState(true)
  const [showMeanWaterLevel, setShowMeanWaterLevel] = useState(true)

  const legendLabelStyle = (margin) => {
   return {    
      position: 'absolute',
      top: margin.top * 2,
      left: 0,
      right: 0,
      marginLeft: 'auto',
      marginRight: 'auto',  
      width: 'fit-content',
      height: '25px',
      display: 'flex',
      flexDirection:"row",
      justifyContent: 'center',
      alignItems:'center',
      fontSize: '12px',
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
    if(label.text == "Historical Simulation"){
      setShowHistoricalData(showHistoricalData => !showHistoricalData);
    }
    if(label.text == "Water Level Value"){
      setShowMeanWaterLevel(showMeanWaterLevel => !showMeanWaterLevel);
    }
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
                  <div>
                  <LegendItem
                    key={`legend-${i}`}
                    margin="8px 8px 8px 0"
                    onClick={() => {
                      // alert(`clicked: ${DataContext}`);
                      console.log(labels)
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
            xScale={{ type: "band", paddingInner: 0.5 }}
            yScale={{ type: "linear", zero: false }}
          >
          <XYChart
          // parentWidth={parent.width}
          // parentHeight={parent.height}
          // parentTop={parent.top}
          // parentLeft={parent.left}
          // //this is the referer to the wrapper component
          // parentRef={parent.ref}
          // this function can be called inside MySuperCoolVisxChart to cause a resize of the wrapper component
          // resizeParent={parent.resize}
          width={1680}
          height={300}
          margin={{ left: 60, top: 35, bottom: 38, right: 27 }}
          xScale={{ type: "time" }}
          yScale={{ type: "linear", zero: false }}
          
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
          {xyData.map(function(lineData) {
            // console.log(xyData)
            if(isHydroDataOn && (lineData['dataKey'] !== "Historical Simulation" && !lineData['dataKey'].startsWith('Bias Corrected'))){
              console.log("Hydroweb Data",isHydroDataOn)
                return (
                    legendToggle[`${lineData['dataKey']}`] &&
                    <LineSeries
                      key={lineData['dataKey']}
                      // stroke={lineData['stroke']}
                      dataKey={lineData['dataKey']}
                      data={lineData['data']}
                      {...normal_accesors}
                      curve={curveCardinal}
                      colorAccessor ={(d)=>lineData['stroke']}
                  />
                 );
              
            }
            if(isGeoglowsActive && lineData['dataKey'] == "Historical Simulation"){
              console.log("Historical Simulation",isGeoglowsActive)
              return (
                legendToggle[`${lineData['dataKey']}`] &&
                <LineSeries
                  key={lineData['dataKey']}
                  // stroke={lineData['stroke']}
                  dataKey={lineData['dataKey']}
                  data={lineData['data']}
                  {...normal_accesors}
                  curve={curveCardinal}
              />
              );
            }
            if(isBiasCorrectionOn && lineData['dataKey'].startsWith('Bias Corrected')){
              console.log("Hydroweb Bias Corrected",isBiasCorrectionOn)
              return (
                legendToggle[`${lineData['dataKey']}`] &&

                <LineSeries
                  key={lineData['dataKey']}
                  // stroke={lineData['stroke']}
                  dataKey={lineData['dataKey']}
                  data={lineData['data']}
                  {...normal_accesors}
                  curve={curveCardinal}
              />
              );
            }
            if(isForecastOn && lineData['dataKey'].includes('Forecast')){
              console.log("Hydroweb Forecast Bias Corrected",isBiasCorrectionOn)
              return (
                legendToggle[`${lineData['dataKey']}`] &&

                <LineSeries
                  key={lineData['dataKey']}
                  // stroke={lineData['stroke']}
                  dataKey={lineData['dataKey']}
                  data={lineData['data']}
                  {...normal_accesors}
                  curve={curveCardinal}
              />
              );
            }
    
          })}
          {/* <AnimatedLineSeries
            stroke="#2B4865"
            dataKey="Water Level Value"
            data={xyData}
            // xAccessor={accessors_fin.xAccessor['val']}
            // yAccessor={accessors_fin.yAccessor['val']}
            {...normal_accesors}
            curve={curveCardinal}
    
          />
    
          <AnimatedLineSeries
            stroke="#256D85"
            dataKey="Maximun"
            data={xyMax}
            {...normal_accesors}
            curve={curveCardinal}
          />
          <AnimatedLineSeries
            stroke="#8FE3CF"
            dataKey="Minimun"
            data={xyMin}
            {...normal_accesors}
            curve={curveCardinal}
          /> */}
          {/* <AnimatedLineSeries
            stroke="#0000"
            dataKey="Historical Simulation"
            data={xyHistorical}
            {...normal_accesors}
            curve={curveCardinal}
          /> */}
    
    
        <Tooltip
                showVerticalCrosshair
                snapTooltipToDatumX
                renderTooltip={({ tooltipData, colorScale }) =>
                  tooltipData.nearestDatum.key && (
                    <>
                      <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>
                        {tooltipData.nearestDatum.key}
                      </div>
                      <br />
                      {
                        // (d) => new Date(`${d.x}T00:00:00`)
                        normal_accesors.xAccessor(
                          tooltipData.datumByKey[tooltipData.nearestDatum.key].datum
                        )
                      }
                      :{" "}
                      {normal_accesors.yAccessor(
                        tooltipData.datumByKey[tooltipData.nearestDatum.key].datum
                      ).toFixed(2)}
                    </>
                  )
                }
              />
    
    
        </XYChart>
        <ChartLegend />
        </DataProvider>
        </ChartContainer>


    // )}
  // </ParentSize>


  );
};

export default LineXYChartWrapper;
/*
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) => (
          <div>
            <div style={{ color: colorScale(tooltipData.datumByKey.key) }}>
              {tooltipData.datumByKey.key}
            </div>
            {normal_accesors.yAccessor(tooltipData.nearestDatum.datum)}

          </div>
        )}
      />

      <AnimatedAreaSeries
        fill="#256D85"
        dataKey="Maximun"
        data={xyData}
        xAccessor={accessors_fin.xAccessor['max']}
        yAccessor={accessors_fin.yAccessor['max']}
        x0Accessor={accessors_fin.x0Accessor['max']}
        y0Accessor={accessors_fin.y0Accessor['max']}
        // {...accessors_max}
        fillOpacity={0.3}
        curve={curveCardinal}
        renderLine={false}

      />
      <AnimatedAreaSeries
        fill="#8FE3CF"
        dataKey="Minimun"
        data={xyData}
        xAccessor={accessors_fin.xAccessor['min']}
        yAccessor={accessors_fin.yAccessor['min']}
        x0Accessor={accessors_fin.x0Accessor['min']}
        y0Accessor={accessors_fin.y0Accessor['min']}
        // {...accessors_min}
        fillOpacity={0.7}
        curve={curveCardinal}
        renderLine={false}

      />


<Tooltip
snapTooltipToDatumX
snapTooltipToDatumY
showSeriesGlyphs
glyphStyle={{
  fill: "#2B4865",
  strokeWidth: 1
}}
renderTooltip={({ tooltipData }) => {
  return (
    <TooltipContainer>
      {Object.entries(tooltipData.datumByKey).map((lineDataArray) => {
        // console.log()
        const [key, value] = lineDataArray;
        console.log(key)
        return (
          <>
            {
            (key == 'Water Level Value') && 
              (<div className="row" key={`${key}`}>
              <div className="date">
                {format(accessors_fin.xAccessor.val(value.datum), "MMM d")}
              </div>
              <div className="value">
                  <ColoredSquare color="#2B4865" />
                  {accessors_fin.yAccessor.val(value.datum)}
              </div>
            </div>)
            }
            {
            (key == 'Maximun') && (
              <div className="row" key={key}>
                <div className="value">
                  <ColoredSquare color="#256D85" />
                  {accessors_fin.yAccessor.max(value.datum)}
                </div>
              </div>)
            }
            {
            (key == 'Minimun') && (
              <div className="row" key={key}>
                  <div className="value">
                    <ColoredSquare color="#8FE3CF" />
                    {accessors_fin.y0Accessor.min(value.datum)}
                </div>
              </div>
              )

            }
        </>
        );
      })}
    </TooltipContainer>
  );
}}
/>
*/
