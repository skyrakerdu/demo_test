<template>
    <div>
        <p>地图1</p>
        <div id="map1"></div>
        <p>地图2</p>
        <div id="map2"></div>
    </div>
</template>

<script>
import 'ol/ol.css'
import View from 'ol/View'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'


export default {
    name:'HomeDoubleMap',
    mounted() {
        var dview = new View({
            center:[0,0],
            zoom:2
        })

        var layers1=[
            new TileLayer({
                source: new OSM()
            })
        ]

        var layers2=[
            new TileLayer({
                source: new OSM()
            })
        ]

        var map1=new Map({
            target:'map1',
            layers:layers1,
            view:dview

        })

        var map2=new Map({
            layers:layers2,
            target:'map2',
            view:dview
        })
    }
}

</script>

<style lang="stylus" scoped>
    #map1 {
        height:250px;
        width:600px;
    }
    #map2 {
        height:250px;
        width:600px;
    }
</style>