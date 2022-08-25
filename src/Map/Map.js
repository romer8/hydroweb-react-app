import React, { useRef, useState, useEffect } from "react"
// import "./Map.css";
import MapContext from "./MapContext";
import * as ol from "ol";
import { MapContainer } from '../styles/Map.styled'
const Map = ({ children, zoom, center }) => {
	const mapRef = useRef();
	const [map, setMap] = useState(null);

	// on component mount
	useEffect(() => {
		console.log("usEffect Map.js");
		let options = {
			view: new ol.View({ zoom, center }),
			layers: [],
			controls: [],
			overlays: []
		};

		let mapObject = new ol.Map(options);
		mapObject.setTarget(mapRef.current);
		setMap(mapObject);
		return () => {
			mapObject.setTarget(undefined)
		};
	}, []);

	// zoom change handler
	useEffect(() => {
		if (!map) return;

		map.getView().setZoom(zoom);
	}, [zoom]);

	// center change handler
	useEffect(() => {
		if (!map) return;

		map.getView().setCenter(center)
	}, [center])

	return (
		<MapContainer>
			<MapContext.Provider value={{ map }}>
				<div ref={mapRef} className="ol-map">
						{children}
				</div>
			</MapContext.Provider>
		</MapContainer>



	)
}

export default Map;