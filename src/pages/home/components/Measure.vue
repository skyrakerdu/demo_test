<template>
<div>
    <title>Measure</title>
    
    <div id='map' class='map'></div>
    <form class='form-inline'>
        <label>Mesurement type &nbsp;</label>
        <select id='type'>
            <option value='length'>Length (LineString)</option>
            <option value='area'>Area (Polygon)</option>
        </select>
    </form>
</div>

</template>

<script>
import 'ol/ol.css';
import Draw from 'ol/interaction/Draw';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import {Circle as CircleStyle,Fill,Stroke,Style} from 'ol/style';
import {LineString,Polygon} from 'ol/geom';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {getArea, getLength} from 'ol/sphere';
import {unByKey} from 'ol/Observable';

var raster = new TileLayer({
    source: new OSM(),
});

var source = new VectorSource();

var vector = new VectorLayer({
    source:source,
    style:new Style({
        fill:new Fill({
            color:'rgba(255,255,255,0.2)',
        }),
        stroke: new Stroke({
            color:'#ffcc33',
            width:2,
        }),
        image: new CircleStyle({
            radius:7,
            fill:new Fill({
                color:'#ffcc33',
            }),
        }),
    }),
});

//
var sketch;

var helpTooltipElement;

var measureTooltipElement;

var measureTooltip;
</script>

<style>

</style>