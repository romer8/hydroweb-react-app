import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import VectorLayer from "ol/layer/Vector";

const VectorLayerWrapper = ({ source, style, zIndex = 0 }) => {
	const { map } = useContext(MapContext);
	// const [vectorLayerSource, setVectorLayerSource] = useState();


	useEffect(() => {
		console.log("useEffect vectorLayer");
		
		if (!map) return;

		let vectorLayerMap

		vectorLayerMap = new VectorLayer({
			source,
			style
		});

		map.addLayer(vectorLayerMap);
		vectorLayerMap.setZIndex(zIndex);
		// console.log("adding extent",source.getExtent())

		// console.log("fitting",typeof(source))

		return () => {
			if (map) {
				console.log("here removing vector layer")

				map.removeLayer(vectorLayerMap);

			}


		};
	}, [map]);


	return null;
};

export default VectorLayerWrapper;