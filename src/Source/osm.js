import * as olSource from "ol/source";

function osm() {
	return new olSource.OSM({
			crossOrigin: null
		}
		
	);
}

export default osm;