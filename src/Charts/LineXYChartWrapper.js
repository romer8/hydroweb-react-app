import { format } from "date-fns";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  AnimatedAreaSeries,
  Tooltip,
  XYChart,
  curve
} from "@visx/xychart";
import { ParentSize } from '@visx/responsive';

import { ChartContainer } from "../styles/ChartContainer.styled";
import { ColoredSquare } from "../styles/ColoredSquare.styled";
import { TooltipContainer } from "../styles/TooltipContainer.styled";
import { useState } from "react";

const data1 = [
  {
    x: "2018-03-01",
    y: 30
  },
  {
    x: "2018-04-01",
    y: 16
  },
  {
    x: "2018-05-01",
    y: 17
  },
  {
    x: "2018-06-01",
    y: 24
  },
  {
    x: "2018-07-01",
    y: 47
  },
  {
    x: "2018-08-01",
    y: 32
  },
  {
    x: "2018-09-01",
    y: 8
  },
  {
    x: "2018-10-01",
    y: 27
  },
  {
    x: "2018-11-01",
    y: 31
  },
  {
    x: "2018-12-01",
    y: 105
  },
  {
    x: "2019-01-01",
    y: 166
  },
  {
    x: "2019-02-01",
    y: 181
  },
  {
    x: "2019-03-01",
    y: 232
  },
  {
    x: "2019-04-01",
    y: 224
  },
  {
    x: "2019-05-01",
    y: 196
  },
  {
    x: "2019-06-01",
    y: 211
  }
];

const tickLabelOffset = 10;

const accessors_val = {
  xAccessor: (d) => new Date(`${d.date}T00:00:00`),
  yAccessor: (d) => d.orthometric_height_of_water_surface_at_reference_position
};
const accessors_max = {
  xAccessor: (d) => new Date(`${d.date}T00:00:00`),
  yAccessor: (d) => d.up_uncertainty
};
const accessors_min = {
  xAccessor: (d) => new Date(`${d.date}T00:00:00`),
  yAccessor: (d) => d.down_uncertainty
};

const LineXYChartWrapper = ({ xyData }) => {

  return (
    <ChartContainer>


      <XYChart
        height={350}
        margin={{ left: 60, top: 35, bottom: 38, right: 27 }}
        xScale={{ type: "time" }}
        yScale={{ type: "linear", zero: false }}
        
      >
        <AnimatedGrid
          columns={false}
          numTicks={4}
          lineStyle={{
            stroke: "#e1e1e1",
            strokeLinecap: "round",
            strokeWidth: 1
          }}
          strokeDasharray="0, 4"
        />
        <AnimatedAxis
          hideAxisLine
          hideTicks
          orientation="bottom"
          tickLabelProps={() => ({ dy: tickLabelOffset })}
          left={30}
          numTicks={4}
        />
        <AnimatedAxis
          hideAxisLine
          hideTicks
          orientation="left"
          numTicks={4}
          tickLabelProps={() => ({ dx: -10 })}
        />

        <AnimatedAreaSeries
          stroke="#3C4F76"
          dataKey="Water Level Value"
          data={xyData}
          {...accessors_val}
          fillOpacity={0.4}

        />
        <AnimatedAreaSeries
          stroke="#383F51"
          dataKey="Maximun"
          data={xyData}
          {...accessors_max}
          fillOpacity={0.4}
        />
        <AnimatedAreaSeries
          stroke="#DDDBF1"
          dataKey="Minimun"
          data={xyData}
          {...accessors_min}
          fillOpacity={0.4}

        />
        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          showSeriesGlyphs
          glyphStyle={{
            fill: "#008561",
            strokeWidth: 0
          }}
          renderTooltip={({ tooltipData }) => {
            return (
              <TooltipContainer>
                {Object.entries(tooltipData.datumByKey).map((lineDataArray) => {
                  const [key, value] = lineDataArray;

                  return (
                    <div className="row" key={key}>
                      <div className="date">
                        {format(accessors_val.xAccessor(value.datum), "MMM d")}
                      </div>
                      <div className="value">
                        <ColoredSquare color="#008561" />
                        {accessors_val.yAccessor(value.datum)}
                      </div>
                    </div>
                  );
                })}
              </TooltipContainer>
            );
          }}
        />
      </XYChart>
    </ChartContainer>
  );
};

export default LineXYChartWrapper;
