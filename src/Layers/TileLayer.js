import { useContext, useEffect,useState } from "react";
import MapContext from "../Map/MapContext";
import OLTileLayer from "ol/layer/Tile";

const TileLayer = ({ source, opacity, layerClass, zIndex = 0 }) => {
	const { map } = useContext(MapContext);
	// const [opacityLayer, SetOpacityLayer ] = useState(opacity);
	const [layer, setLayertile] = useState();

	useEffect(() => {
		console.log("tilevecote");
		if (!map) return;

		let tileLayer = new OLTileLayer({
			className: layerClass,
			source,
			zIndex,
			opacity
		});
		tileLayer.set('name', layerClass)
		map.addLayer(tileLayer);
		tileLayer.setZIndex(zIndex);
		setLayertile(tileLayer)
		return () => {
			if (map) {
				map.removeLayer(tileLayer);
			}
		};
	}, [map]);

	useEffect(() => {

		if (!layer) return;
		var layer_prop = map.getLayers().getArray().find(layer => layer.get('name') == layerClass);
		layer_prop.setOpacity(Number(opacity))
				  
	}, [opacity]);


	return null;
};

export default TileLayer;
