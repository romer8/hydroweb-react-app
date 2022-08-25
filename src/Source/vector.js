import { Vector as VectorSource } from 'ol/source';


function vector(features) {
	return new VectorSource(
		features
		// format: new GeoJSON(),
		// url: function (extent) {
		//   return (
		// 	'https://geoserver.hydroshare.org/geoserver/HS-22714855232d44198d12aa4109ec8478/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=HS-22714855232d44198d12aa4109ec8478:GEOGLOWS_SilviaV3&outputFormat=application/json'+
		// 	'&srsname=EPSG:4326'
		//   );
		// },
		// strategy: bboxStrategy,
	);
}

export default vector;
