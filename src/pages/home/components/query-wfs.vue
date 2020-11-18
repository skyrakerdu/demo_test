<template> 
</template>

<script>
import VectorLayer from 'ol/layer/Vector';
import {Vector} from "ol/source";
import GeoJSON from 'ol/format/GeoJSON';
import {Stroke,Style} from 'ol/style';
export default {
  name:'QueryWfs',
  props:['url','geoname','projection'],
  data() {
    return {
      wfsVectorLayer:null,
    }
  },
  mounted() {
    this.initWfs();
  },

  methods:{
    initWfs() {
      this.wfsVectorLayer = new VectorLayer({
        source: new Vector({
          format: new GeoJSON({
            geometryName:this.geoname||'geom'
          }),
          projection:this.projection||'EPSG:3857',
          url:this.url||'http://localhost:8080/geoserver/pipe/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pipe:analog_pipe&maxFeatures=50&outputFormat=application%2Fjson'
        }),
        style: function(feature,resolution) {
          return new Style({
            stroke:new Stroke({
              color:'blue',
              width:5
            })
          });
        },
        zIndex:10
      });
      this.$emit("InitWfs",this.wfsVectorLayer);
    }
  },

  created: function () {
    //this.$emit('InitWfs',this.wfsVectorLayer);
  }

}
</script>

<style>

</style>