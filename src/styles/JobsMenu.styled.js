import styled from "styled-components";

// flex:1 1 20%;
// order: 1;
export const JobsMenu = styled.div`
    height: fit-content;

    overflow-y: hidden;
    padding:5px;
    position:absolute;
    z-index:300;
    top:20px;

    .wrapper_absolute{
        width: fit-content;
        height: fit-content;
        padding: 10px;
        background-color:rgba(12, 74, 110, 0.5);        ;
        border-color: blue;
        color:#e0f2fe;
        font-size:1rem;
    }

    .mycontainer{
        display:flex;
        justify-items:center;
        padding-top:0px;
    }
    .prompt{
        padding-right:4%;
    }
    .slider-parent{
        position:relative;
    }
    .mainContainer{
        padding-top:20px;
    }
    .sudo_title{
        font-weight: bold;
    }
    .slider-parent{
        padding-left:20px;
    }
    
    .dropdown-menu {
        height: 100px;
        overflow-y: scroll;
        font-size:1rem;
    }
    .dropdown-toggle {
        font-size:1rem;
    }
    .span_div{
        font-size: 10px;
        color: #666;
        font-weight: 400;
        letter-spacing: .5px;
        padding-left:10px;
        color:#e0f2fe;
    }

`;
