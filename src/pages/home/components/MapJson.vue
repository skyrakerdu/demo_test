<template>
    <div>
        <div id='map'></div>
        <span id='status'></span>
        <form class ="form-inline">
            <label>Measurement Type &nbsp;</label>
            <select id='type'>
                <option value='length'>Length(LineString)</option>
                <option value='area'>Area (Polygon)</option>
            </select>
        </form>
    </div>
</template>

<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import OSM from 'ol/source/OSM'
import GeoJSON from 'ol/format/GeoJSON'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import {Fill,Stroke,Style,Text} from 'ol/style'
import { fromLonLat } from 'ol/proj'


import Measure from './../js/ameasure'



export default {
    name:'HomeMapJson',
    data() {
        return {
            imap:null
        }
    },
    mounted() {        
        var highlightStyle=new Style({
            fill:new Fill({
                color:'rgba(255,255,255,0.7)',
            }),
            stroke:new Stroke({
                color:'#3399CC',
                width:6,
            }),
        })

        var vectorSource = new VectorSource({
            //features: (new GeoJSON()).readFeatures(geojsonObject)
            url: './../../../../static/全国.json',
            //url:'./../components/全国.json',
            format:new GeoJSON()
        })
        
        var vectorLayer =new VectorLayer({
            source:vectorSource
        })

        var map=new Map({
            layers:[
                new TileLayer({source:new OSM()}),
                vectorLayer],
            target:'map',
            view:new View({
                center:[0,0],
                zoom:2,
            })
        })

        var selected=null;
        var status=document.getElementById('status'); 
        this.imap=map; 
        map.on('pointermove',function(e) {
            if (selected !==null) {
                selected.setStyle(undefined);
                selected=null;
            }
            map.forEachFeatureAtPixel(e.pixel,function(f) {
                selected=f;
                f.setStyle(highlightStyle);
                return true;
            });
            if(selected) {
                status.innerHTML = '&nbsp;Hovering: ' + selected.get('name');
            } else {
                status.innerHTML = '&nbsp;';
            }            
        })   
    },
    methods: {
        length() {
            Measure.measure(this.imap,'LineString');
        },

        area() {
            Measure.measure(this.imap,'Polygon');
        }

    }
        
}
</script>

<style lang='stylus' scoped>
    #map{
        width: 100%;
        height: 850px;
    }
    #ol-tooltip {
        position: relative;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        color: white;
        padding: 4px 8px;
        opacity: 0.7;
        white-space: nowrap;
        font-size: 12px;
    }
    #ol-tooltip-measure {
        opacity: 1;
        font-weight: bold;
      }
    #ol-tooltip-static {
        background-color: #ffcc33;
        color: black;
        border: 1px solid white;
    }
    #ol-tooltip-measure:before,
    #ol-tooltip-static:before {
        border-top: 6px solid rgba(0, 0, 0, 0.5);
        border-right: 6px solid transparent;
        border-left: 6px solid transparent;
        content: "";
        position: absolute;
        bottom: -6px;
        margin-left: -7px;
        left: 50%;
    }
    #ol-tooltip-static:before {
        border-top-color: #ffcc33;
    }

</style>