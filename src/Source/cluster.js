import { Cluster } from 'ol/source';

function cluster(features) {
	return new Cluster(
		features
	);
}

export default cluster;


