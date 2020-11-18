<template>
    <div>
        <div id="mapcontainer"></div>
    <!-- <input type="checkbox" v-model="select_checked" value="选择" />选择 -->
    </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

export default {
  name: "HomeSelectFeatures",
  data() {
    return {
      select_checked: true,
    }
  },

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

    var map1=new Map({
        target:'mapcontainer',
        layers:layers1,
        view:dview
    })
  },

  methods: {
  },
};
</script>

<style>
#mapcontainer {
  width: 100%;
  height: 900px;
}
</style>
