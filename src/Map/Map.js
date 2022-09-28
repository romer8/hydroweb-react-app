import React, { useRef, useState, useEffect } from "react"
// import "./Map.css";
import MapContext from "./MapContext";
import * as ol from "ol";
import * as olExtent from 'ol/extent';

import { MapContainer } from '../styles/Map.styled'
const Map = ({ children, zoom, center,setSelectedFeature, isFullMap, setSelectedGeoglows, setIsHydroDataOn }) => {
	const mapRef = useRef();
	const [map, setMap] = useState(null);

	const onClickFeature = (evt) => {
		console.log(evt)
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			function(feature, layer) {
			 return feature;
		   });
		  if (feature) {
			 var coord = evt.feature.getGeometry().getCoordinates();
			 console.log(coord)
			//  popup.show(coord, '<div><h2>Tilte</h2><p>' +feature.get('<property_in_single_quotes>')+ '</p></div>');  
		 }
	  } 
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
	useEffect(()=>{

		if (!map) return;

		map.on('click',evt=>{
			// console.log(evt);
			// console.log(evt.pixel);
			const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
			if(feature){
				var multipleFeatures = feature.get('features');
				// if single feature show popup and maybe zoom in
				if(multipleFeatures.length < 2){
					// console.log(multipleFeatures);
					setSelectedFeature(multipleFeatures[0].get("comid"))
					setSelectedGeoglows(multipleFeatures[0].get("comid_geoglows"))
					setIsHydroDataOn(true)

				}
				// if multiple features just zoom in
				else{
					console.log("multiple features");
					
					const extent = olExtent.boundingExtent(
						multipleFeatures.map((r) => r.getGeometry().getCoordinates())
					  );
					map.getView().fit(extent, {duration: 1300, padding: [50, 50, 50, 50]});
				}
			//   console.log();
			}
		  });
		  map.on('pointermove',evt=>{
			var hit = false;
			const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
			if(feature){
				hit = true;
				map.getViewport().style.cursor = hit ? 'pointer' : '';
			}
			else{
				hit = false;
				map.getViewport().style.cursor = hit ? 'pointer' : '';
			}
		  });
	},[map])
	// zoom change handler
	useEffect(() => {
		if (!map) return;

		map.getView().setZoom(zoom);
	}, [zoom]);

	// center change handler
	// useEffect(() => {
	// 	if (!map) return;
	// 	console.log("asfasf")
	// 	map.getView().setCenter(center)
	// }, [center])

	return (
		<MapContainer isFullMap={isFullMap} >
			<MapContext.Provider value={{ map }}>
				<div ref={mapRef} className="ol-map" >
						{children}
				</div>
			</MapContext.Provider>
		</MapContainer>



	)
}

export default Map;