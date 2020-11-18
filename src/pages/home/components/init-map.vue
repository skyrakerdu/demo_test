<template>
    <div id='map' ></div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { defaults as defaultControls,FullScreen,ScaleLine,ZoomSlider,OverviewMap} from "ol/control";
import {fromLonLat} from 'ol/proj';
export default {
  name:'InitMap',
  props:["zoom"],
  data(){
    return{
      map:null
    }
  },
  mounted(){
    this.initmap();
  },
  created(){},
  watch:{

  },
  methods:{
    initmap:function(){
      var layer = new TileLayer({
        source: new XYZ({
                  url:"http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
                })
			});
			var overviewMapControl = new OverviewMap({
        layers:[layer],
        zoom:8
			})
      this.map = new Map({
        target:'map',
        view: new View({
                projection:'EPSG:3857',
                center:fromLonLat([112.94438, 28.17004]),
                zoom:this.zoom || 18
              }),
        layers:[layer],
        controls: [new ZoomSlider(),new ScaleLine()]
      })
    },

    //移动地图函数，供父组件和兄弟组件调用
    changeViewCenter(newcenter){
      var view = this.map.getView();
      view.setCenter(fromLonLat(newcenter));
      view.setZoom(18);
    },

    //添加图层公共函数，供父组件和兄弟组件调用
    customizedLayerControl(type,layer){
      if(type=='add'){
        this.map.addLayer(layer);
      }
      else if(type=='remove'){
        this.map.removeLayer(layer);
      }
      else {
        console.log("controltype error!")
      }
    },

    customizedInteractionControl(type,interaction){
      if(type=='add'){
        this.map.addInteraction(interaction);
      }
      else if(type=='remove'){
        this.map.removeInteraction(interaction);
      }
      else {
        console.log("control error!");
      }
    }
  },
}
</script>
<style scoped>
#map{
  width:100%;
  height:100%;
}
</style>