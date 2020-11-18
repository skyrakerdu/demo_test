import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import Overlay from 'ol/Overlay';
import XYZ from 'ol/source/XYZ';
import { defaults as defaultControls} from "ol/control";
import {FullScreen, ScaleLine} from "ol/control";
import {ZoomSlider} from 'ol/control';
import {OverviewMap} from 'ol/control';
import {fromLonLat} from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {Fill,Stroke,Style,Text} from 'ol/style';

//import JsonFunction from './JsonFunction'

export default {
  loadmap(mapcontainer,status) {
    var view = new View({
      projection:'EPSG:3857',
      center:fromLonLat([116.4080,39.9036]),
      zoom:15
    });
    var layer = new TileLayer({
      source: new XYZ({
        url:'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
      })
    });
    var overviewMapControl = new OverviewMap({
      layers:[
        new TileLayer({
            source: new XYZ({
                url:"http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
            })
        })
      ]
    });
    var vectorSource = new VectorSource({
      projection: 'EPSG:3857',
      url:'./../../../../static/全国.json',
      format:new GeoJSON()
    });

    var vectorLayer = new VectorLayer({
      source:vectorSource
    });
    var map=new Map({
      layers:[layer,vectorLayer],
      view:view,
      controls: defaultControls({ zoom: 8 }).extend([overviewMapControl]),
      loadTilesWhileAnimating:true,
      target:mapcontainer
    });
    map.addControl(new FullScreen());
    map.addControl(new ScaleLine());
    map.addControl(new ZoomSlider());
    // map.addLayer(JsonFunction.loadjson());

    var highlightstyle = new Style({
      fill:new Fill({
        color:'rgba(255,255,255,0.1)',
      }),
      stroke:new Stroke({
        color:'#3399CC',
        width:4
      }),
    });

    var selected=null;
    var status=document.getElementById('status');  
    map.on('pointermove',function(e) {
      if (selected !==null) {
        selected.setStyle(undefined);
        selected=null;
      }
      map.forEachFeatureAtPixel(e.pixel,function(f) {
        selected=f;
        f.setStyle(highlightstyle);
        return true;
      });
      if(selected) {
        status.innerHTML = '&nbsp;Hovering: ' + selected.get('name');
      } else {
        status.innerHTML = '&nbsp;';
      }            
    });
  }
}