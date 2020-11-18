import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
//import OSM from 'ol/source/OSM'
import Layer from 'ol/layer/Layer'
import GeoJSON from 'ol/format/GeoJSON'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import {Fill,Stroke,Style,Text} from 'ol/style'
import { fromLonLat } from 'ol/proj'

export default {
  loadjson() {
    var highlightstyle = new Style({
      fill:new Fill({
        color:'rgba(255,255,255,0.7)',
      }),
      stroke:new Stroke({
        color:'#3399CC',
        width:4
      }),
    });
    
    var vectorSource = new VectorSource({
      projection: 'EPSG:3857',
      url:'./../../../../static/全国.json',
      format:new GeoJSON()
    });

    var vectorLayer = new VectorLayer({
      source:vectorSource
    });
    return vectorLayer;
  }
}