import styled from "styled-components";

export const LegendSwitcher = styled.div`
    height: 100%;
    z-index:800;
    display:flex;
    color:'white',
    font-family: 'arial',
    background-color: 'rgba(0,0,0,.5)',
    border-radius: '2px',
    font-size: 10px;
    flex-direction: column;
    flex-basis:content;
    
    /* Toggle Button */
    .cm-toggle {
        -webkit-appearance: none;
        -webkit-tap-highlight-color: transparent;
        position: relative;
        border: 0;
        outline: 0;
        cursor: pointer;
        margin: 10px;
    }
    
    
    /* To create surface of toggle button */
    .cm-toggle:after {
        content: '';
        width: 30px;
        height: 15px;
        display: inline-block;
        background: rgba(196, 195, 195, 0.55);
        border-radius: 18px;
        clear: both;
    }
    
    
    /* Contents before checkbox to create toggle handle */
    .cm-toggle:before {
        content: '';
        width: 15px;
        height: 17px;
        display: block;
        position: absolute;
        left: 0;
        top: -3px;
        border-radius: 50%;
        background: rgb(255, 255, 255);
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
    }
    
    
    /* Shift the handle to left on check event */
    .cm-toggle:checked:before {
        left: 15px;
        box-shadow: -1px 1px 3px rgba(0, 0, 0, 0.6);
    }
    /* Background color when toggle button will be active */
    .cm-toggle:checked:after {
        background: #9a336a;
    }

    .iconColorLegend{
        background-color: #9a336a;
        border-radius:4px;
        color: white;
        width:30px;
        height:30px;
    }
    svg{
        padding-left:2px;
        padding-right:5px;
    }

    span{
        overflow-wrap: break-word;
        width:70%;
    }
    div{
        padding:2px;
        display:flex;
    }
    .hiddenElement{
        display:none;
    }

    button{
        cursor: pointer;
    }
`;

