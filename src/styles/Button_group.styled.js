import styled from "styled-components";


export const ButtonGroup = styled.div`
    .multi-button {
        display: ${props => (props.isFullMap ? 'none' : 'flex')};

        justify-content: space-between;
        align-items: center;
        
        
        button {
        flex: 1;
        -moz-appearance: none;
        -webkit-appearance: none;
        position: relative;
        padding: 1rem 2rem;
        border: 2px solid #f2f2f2;
        text-transform: uppercase;
        font-weight: 500;
        font-size: 1em;
        letter-spacing: 1px;
        box-shadow: 1px 1px 20px rgba(0,0,0,.1);
        color: #9a336a;
        background: transparent;
        overflow: hidden;
        
        &::before,
        &::after {
            position: absolute;
            content: "";
            left: 0;
            right: 0;
            bottom: 0;
        }
        
        &::after {
            height: 0;
            background-color: #9a336a;
            transition: height .5s ease;
            z-index: -1;
        }
        
        &::before {
            background-color: #fff;
            height: 100%;
            z-index: -2;
        }
        
        &:hover {
            color: #fff;
            transition: 0.1s ease;
            
            &::after {
            height: 100%;
            }
            
        }
        
        &:nth-of-type(1) {
            border-radius: 6px 0 0 6px;
        }
        
        &:nth-of-type(3) {
            border-radius: 0 6px 6px 0;
        }
        }
    }
    
    @keyframes towhite {
        0%   { color: inherit; }
        100% { color: white; }
    }
`;