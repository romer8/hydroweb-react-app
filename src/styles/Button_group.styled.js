import styled from "styled-components";


export const ButtonGroup = styled.div`
    #check_hydroweb{
        display: ${props => (props.isSuccessfulHydroWeb ? 'inline' : 'none')};
    }
    #check_historical_sim{
        display: ${props => (props.isSuccessfulHistoricalSimulation ? 'inline' : 'none')};
    }
    #check_historical_bias{
        display: ${props => (props.isSuccessfulHistoricalBiasCorrection ? 'inline' : 'none')};
    }
    #check_forecast_bias{
        display: ${props => (props.isSuccessfulForecastBiasCorrection ? 'inline' : 'none')};
    }
    #check_hydroweb_fail{
        display: ${props => (props.isSuccessfulHydroWeb ? 'none' : 'inline')};
    }
    #check_historical_sim_fail{
        display: ${props => (props.isSuccessfulHistoricalSimulation ? 'none' : 'inline')};
    }
    #check_historical_bias_fail{
        display: ${props => (props.isSuccessfulHistoricalBiasCorrection ? 'none' : 'inline')};
    }
    #check_forecast_bias_fail{
        display: ${props => (props.isSuccessfulForecastBiasCorrection ? 'none' : 'inline')};
    }

    .multi-button {

        .numberCircle{
            width: 20px;
            line-height: 12px;
            // border-radius: 40%;
            text-align: center;
            border: 2px solid #fffff;
            padding:8px;
            background-color: #9a336a;
            color: white;
        }

        display: ${props => (props.isFullMap ? 'none' : 'flex')};

        justify-content: space-between;
        align-items: center;


       
        #hydroweb_data {
                flex: 1;
                -moz-appearance: none;
                -webkit-appearance: none;
                position: relative;
                padding: 1rem 2rem;
                border: 2px solid #f2f2f2;
                text-transform: uppercase;
                font-weight: 500;
                font-size: 0.8em;
                letter-spacing: 1px;
                box-shadow: 1px 1px 20px rgba(0,0,0,.1);
                color: ${props => (props.isSuccessfulHydroWeb ?  '#fff': '#9a336a')};
                background: ${props => (props.isSuccessfulHydroWeb ? '#9a336a' : 'transparent')};
                overflow: hidden;
                cursor: pointer;
    
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
                    background-color: ${props => (props.isSuccessfulHydroWeb ? 'transparent' : '#9a336a' )};
                    color: ${props => (props.isSuccessfulHydroWeb ? '#9a336a' : '#fff')};
                    transition: height .5s ease;
                    z-index: -1;
                }
            
                &::before {
                    background-color: ${props => (props.isSuccessfulHydroWeb ? '#9a336a' : '#fff')};
                    color: ${props => (props.isSuccessfulHydroWeb ? '#9a336a' : '#fff')};                    
                    height: 100%;
                    z-index: -2;
                }
            
                &:hover {
                    color: ${props => (props.isSuccessfulHydroWeb ? '#fff' : '#9a336a')};
                    transition: 0.1s ease;
                    
                    &::after {
                    height: 100%;
                    }
                    
                }
                .numberCircle:hover{
                    background-color: ${props => (props.isSuccessfulHistoricalSimulation ? '#fff' : '9a336a')};
                    color: ${props => (props.isSuccessfulHistoricalSimulation ? '#fff' : '9a336a')};
                }
            
                &:nth-of-type(1) {
                    border-radius: 6px 0 0 6px;
                }
                
                &:nth-of-type(3) {
                    border-radius: 0 6px 6px 0;
                }
            }
        }
            
        #historical_simulation {
            flex: 1;
            -moz-appearance: none;
            -webkit-appearance: none;
            position: relative;
            padding: 1rem 2rem;
            border: 2px solid #f2f2f2;
            text-transform: uppercase;
            font-weight: 500;
            font-size: 0.8em;

            letter-spacing: 1px;
            box-shadow: 1px 1px 20px rgba(0,0,0,.1);
            color: ${props => (props.isSuccessfulHistoricalSimulation ?  '#fff': '#9a336a')};
            background: ${props => (props.isSuccessfulHistoricalSimulation ? '#9a336a' : 'transparent')};
            overflow: hidden;
            cursor: pointer;

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
                background-color: ${props => (props.isSuccessfulHistoricalSimulation ? 'transparent' : '#9a336a' )};
                color: ${props => (props.isSuccessfulHistoricalSimulation ? '#9a336a' : '#fff')};
                transition: height .5s ease;
                z-index: -1;
            }
        
            &::before {
                background-color: ${props => (props.isSuccessfulHistoricalSimulation ? '#9a336a' : '#fff')};
                color: ${props => (props.isSuccessfulHistoricalSimulation ? '#9a336a' : '#fff')};                    
                height: 100%;
                z-index: -2;
            }
        
            &:hover {
                color: ${props => (props.isSuccessfulHistoricalSimulation ? '#fff' : '#fff')};
                transition: 0.1s ease;
                
                &::after {
                height: 100%;
                }
                
            }
            .numberCircle:hover{
                background-color: ${props => (props.isSuccessfulHistoricalSimulation ? '#fff' : '9a336a')};
                color: ${props => (props.isSuccessfulHistoricalSimulation ? '#fff' : '9a336a')};
            }
        
            &:nth-of-type(1) {
                border-radius: 6px 0 0 6px;
            }
            
            &:nth-of-type(3) {
                border-radius: 0 6px 6px 0;
            }
        }
    }

    #bias_correction {
        flex: 1;
        -moz-appearance: none;
        -webkit-appearance: none;
        position: relative;
        padding: 1rem 2rem;
        border: 2px solid #f2f2f2;
        text-transform: uppercase;
        font-weight: 500;
        font-size: 0.8em;

        letter-spacing: 1px;
        box-shadow: 1px 1px 20px rgba(0,0,0,.1);
        color: ${props => (props.isSuccessfulHistoricalBiasCorrection ?  '#fff': '#9a336a')};
        background: ${props => (props.isSuccessfulHistoricalBiasCorrection ? '#9a336a' : 'transparent')};
        overflow: hidden;
        cursor: pointer;

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
            background-color: ${props => (props.isSuccessfulHistoricalBiasCorrection ? 'transparent' : '#9a336a' )};
            color: ${props => (props.isSuccessfulHistoricalBiasCorrection ? '#9a336a' : '#fff')};
            transition: height .5s ease;
            z-index: -1;
        }
    
        &::before {
            background-color: ${props => (props.isSuccessfulHistoricalBiasCorrection ? '#9a336a' : '#fff')};
            color: ${props => (props.isSuccessfulHistoricalBiasCorrection ? '#9a336a' : '#fff')};                    
            height: 100%;
            z-index: -2;
        }
    
        &:hover {
            color: ${props => (props.isSuccessfulHistoricalBiasCorrection ? '#fff' : '#fff')};
            transition: 0.1s ease;
            
            &::after {
            height: 100%;
            }
            
        }
        .numberCircle:hover{
            background-color: ${props => (props.isSuccessfulHistoricalBiasCorrection ? '#fff' : '9a336a')};
            color: ${props => (props.isSuccessfulHistoricalBiasCorrection ? '#fff' : '9a336a')};
        }
    
        &:nth-of-type(1) {
            border-radius: 6px 0 0 6px;
        }
        
        &:nth-of-type(3) {
            border-radius: 0 6px 6px 0;
        }
    }
    #forecast_extrapolation {
        flex: 1;
        -moz-appearance: none;
        -webkit-appearance: none;
        position: relative;
        padding: 1rem 2rem;
        border: 2px solid #f2f2f2;
        text-transform: uppercase;
        font-weight: 500;
        font-size: 0.8em;
        letter-spacing: 1px;
        box-shadow: 1px 1px 20px rgba(0,0,0,.1);
        color: ${props => (props.isSuccessfulForecastBiasCorrection ?  '#fff': '#9a336a')};
        background: ${props => (props.isSuccessfulForecastBiasCorrection ? '#9a336a' : 'transparent')};
        overflow: hidden;
        cursor: pointer;

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
            background-color: ${props => (props.isSuccessfulForecastBiasCorrection ? 'transparent' : '#9a336a' )};
            color: ${props => (props.isSuccessfulForecastBiasCorrection ? '#9a336a' : '#fff')};
            transition: height .5s ease;
            z-index: -1;
        }
    
        &::before {
            background-color: ${props => (props.isSuccessfulForecastBiasCorrection ? '#9a336a' : '#fff')};
            color: ${props => (props.isSuccessfulForecastBiasCorrection ? '#9a336a' : '#fff')};                    
            height: 100%;
            z-index: -2;
        }
    
        &:hover {
            color: ${props => (props.isSuccessfulForecastBiasCorrection ? '#fff' : '#fff')};
            transition: 0.1s ease;
            
            &::after {
            height: 100%;
            }
            
        }
        .numberCircle:hover{
            background-color: ${props => (props.isSuccessfulForecastBiasCorrection ? '#fff' : '9a336a')};
            color: ${props => (props.isSuccessfulForecastBiasCorrection ? '#fff' : '9a336a')};
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

// button {
//     flex: 1;
//     -moz-appearance: none;
//     -webkit-appearance: none;
//     position: relative;
//     padding: 1rem 2rem;
//     border: 2px solid #f2f2f2;
//     text-transform: uppercase;
//     font-weight: 500;
//     font-size: 1em;
//     letter-spacing: 1px;
//     // box-shadow: 1px 1px 20px rgba(0,0,0,.1);
//     // color: #9a336a;
//     background: transparent;
//     overflow: hidden;
//     cursor: pointer;

//     &::before,
//     &::after {
//         position: absolute;
//         content: "";
//         left: 0;
//         right: 0;
//         bottom: 0;
//     }

//     &::after {
//         height: 0;
//         // background-color: #9a336a;
//         transition: height .5s ease;
//         z-index: -1;
//     }

//     &::before {
//         // background-color: #fff;
//         height: 100%;
//         z-index: -2;
//     }

//     &:hover {
//         // color: #fff;
//         transition: 0.1s ease;
        
//         &::after {
//         height: 100%;
//         }
        
//     }
//     .numberCircle:hover{
//         // background-color: white;
//         color: #9a336a;
//     }

//     &:nth-of-type(1) {
//         border-radius: 6px 0 0 6px;
//     }
    
//     &:nth-of-type(3) {
//         border-radius: 0 6px 6px 0;
//     }
// }
// }