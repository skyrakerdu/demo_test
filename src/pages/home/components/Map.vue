<template>
<div>
  <div id='mapcontainer'></div>
  <div class="search-div">
    <el-input id='keyword' v-model='address' name='keyword' placeholder="请输入关键字">
      <el-button slot="append" icon="el-icon-search" @click="SearchKeyword"> </el-button>
    </el-input>
  </div>
  <span id='status'></span>
  <input id='lnglat' disabled type="text">
</div>
</template>
 
<script>

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

import AMap from 'AMap';
// import InitMap from './../js/InitMap'
// import JsonFunction from './../js/JsonFunction'
// import SearchLocate from './../js/SearchLocate'
export default {
  name: 'HomeMap',

  data() {
    return {
      map:'',
      view:'',
      address:'',
    }
  },

  mounted() {
    this.InitMap();
    this.SearchLocate();
  },

  methods: {
    //初始化地图的同时加载矢量
    InitMap:function() {
      this.view = new View({
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
      var highlightstyle = new Style({
        fill:new Fill({
          color:'rgba(255,255,255,0)',
        }),
        stroke:new Stroke({
          color:'#3399CC',
          width:4
        }),
      });
      var map=new Map({
        layers:[layer,vectorLayer],
        view:this.view,
        controls: defaultControls({ zoom: 8 }).extend([overviewMapControl]),
        loadTilesWhileAnimating:true,
        target:'mapcontainer'
      });
      map.addControl(new FullScreen());
      map.addControl(new ScaleLine());
      map.addControl(new ZoomSlider());
      var selected=null;
      var status=document.getElementById('status');
      this.map=map;
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
    },

    //搜索框事件
    SearchLocate:function() {
      var address='';
      var view= this.map.getView();
      var geocoder = new AMap.Geocoder();
      //var address = document.getElementById(inputid).value;
      var autoOptions = {
        city:'全国',
        input:keyword
      };
      var autocomplete = new AMap.Autocomplete(autoOptions);
      AMap.event.addListener(autocomplete, "select", function(data){
        this.address=data.poi.name;
        console.log(data.poi.name);
        //document.getElementById(keyword).value=data.poi.name;
        var mlng=data.poi.location.lng;
        var mlat=data.poi.location.lat;
        // address.location.lng=mlng;
        // address.location.lat=mlat;
        document.getElementById('lnglat').value = mlng+','+mlat;
        view.setCenter(fromLonLat([mlng,mlat]));
        view.setZoom(18);
      });
    },

    //搜索地址
    SearchKeyword: function(e) {           
      var view = this.map.getView();
      var geocoder = new AMap.Geocoder();
      //var marker = new AMap.Marker();
      var address = document.getElementById('keyword').value;
      geocoder.getLocation(address,function(status,result)  {
        if (status === 'complete'&&result.geocodes.length) {
          var lng = result.geocodes[0].location.lng;
          var lat = result.geocodes[0].location.lat;
          document.getElementById('lnglat').value = lng+','+lat;
            view.setCenter(fromLonLat([lng,lat]));
            view.setZoom(18);
        } else {
          log.error('地址查询位置失败');
        }
      });
    },
  }
}
</script>
 
<style lang="stylus" scoped>
#mapcontainer {
  width:100%;
  height:900px;
}
.search-div {
  position: absolute;
  display: flex;
  align-items: center;
  right: 28px;
  top: 50px;
  width: 300px;
  height: 40px;
  box-sizing: border-box;
}
</style>