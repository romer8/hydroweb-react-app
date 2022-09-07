import styled from "styled-components";

export const MapContainer = styled.div`
    & .ol-map{
        width: 100%;
        height: 100%;
        width: 100%;
    }
    flex:1 1 60%;
    order: 1;

    width: 100%;
    overflow-y: hidden;
    position:absolute;
    
    height: ${props => (props.isFullMap ? '100%' : '60%')};

`;
// height: 60%;

// & .ol-map{
//     width: 100%;
//     height: 100%;
//     width: 100%;
// }
// width: 100%;
// height: 100%;
// flex:1 1 80%;
// order: 1;
// overflow-y: hidden;
// position:absolute;
// display:flex;