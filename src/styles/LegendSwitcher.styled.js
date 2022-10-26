import styled from "styled-components";

export const LegendSwitcher = styled.div`
    width: 100%;
    height: 100%;
    z-index:800;
    display:flex;
    font-size: smaller;
    flex-direction: column;
    flex-basis:content;
    flex-wrap: wrap;

    .legendText{
        overflow-wrap: break-word;

    }
    .hiddenElement{
        display:none;
    }

`;

