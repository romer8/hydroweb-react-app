import { format } from "date-fns";
import {
  Axis,
  Grid,
  LineSeries,
  AnimatedAreaSeries,
  Tooltip,
  XYChart,
} from "@visx/xychart";
import { curveCardinal } from '@visx/curve';

import { ParentSize } from '@visx/responsive';

import { ChartContainer } from "../styles/ChartContainer.styled";
import { ColoredSquare } from "../styles/ColoredSquare.styled";
import { TooltipContainer } from "../styles/TooltipContainer.styled";
import { useState } from "react";


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
};

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

const normal_accesors = {
  xAccessor: (d) => new Date(`${d.x}T00:00:00`),
  yAccessor: (d) => d.y
}
// const LineXYChartWrapper = ({ xyData, xyMin, xyMax }) => {
const LineXYChartWrapper = ({ xyData }) => {


  return (

    <ChartContainer>

      <XYChart
      // parentWidth={parent.width}
      // parentHeight={parent.height}
      // parentTop={parent.top}
      // parentLeft={parent.left}
      // //this is the referer to the wrapper component
      // parentRef={parent.ref}
      // this function can be called inside MySuperCoolVisxChart to cause a resize of the wrapper component
      // resizeParent={parent.resize}
      height={350}
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
        console.log(xyData)
          return (
              <LineSeries
                key={lineData['dataKey']}
                stroke={lineData['stroke']}
                dataKey={lineData['dataKey']}
                data={lineData['data']}
                // xAccessor={accessors_fin.xAccessor['val']}
                // yAccessor={accessors_fin.yAccessor['val']}
                {...normal_accesors}
                curve={curveCardinal}
            />
          );
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
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) => (
          <div>
            <div style={{ color: colorScale(tooltipData.datumByKey.key) }}>
              {tooltipData.datumByKey.key}
            </div>
            {/* {normal_accesors.xAccessor(tooltipData.nearestDatum.datum)}
            {', '} */}
            {normal_accesors.yAccessor(tooltipData.nearestDatum.datum)}

          </div>
        )}
      />

    </XYChart>
    </ChartContainer>

    // )}
  // </ParentSize>


  );
};

export default LineXYChartWrapper;
/*

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
