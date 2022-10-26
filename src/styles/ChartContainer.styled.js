import styled from "styled-components";


export const ChartContainer = styled.div`
  width:100%;
  height:95%;
  flex-grow: 2;
  overflow-y:hidden;
  text {
    font-family: "Untitled Sans", sans-serif;
  }
  .hiddenElement{
    display:none;
  }
  .visx-axis-tick {
    text {
      font-size: 12px;
      font-weight: 400;
      fill: #666666;
    }
  }
`;