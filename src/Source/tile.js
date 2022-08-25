import TileWMS from 'ol/source/TileWMS';


function tile(features) {
	return new TileWMS(
		features
	);
}

export default vector;
