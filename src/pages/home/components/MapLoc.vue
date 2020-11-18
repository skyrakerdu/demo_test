<template>
    <div>
        <div>
            <!-- openlayers底图容器 -->
            <div id='map'></div>
            <!--高德地图容器-->
            <div id='mapcon'></div>
        </div>
        <div class="search-div">
            <el-input id='keyword' v-model='address' name='keyword' placeholder="请输入关键字">
                <el-button slot="append" icon="el-icon-search" @click="searchKeyword"> </el-button>
            </el-input>
        </div>
        <!-- 模糊搜索控件 -->
        <!-- <div class="search-div" >
        <el-input id="tipInput" v-model="inputSearchVal" placeholder="请输入搜索名称">
        <el-button slot="append" icon="el-icon-search" @click="searchKeyword"> 
          搜索
        </el-button>
        </el-input>
        </div> -->
        <!-- 模糊搜索控件 -->
        <span id='status'></span>
        <div>
            <button @click="moveToLeft">左移</button>
            <button @click="moveToRight">右移</button>
            <button @click="moveToUp">上移</button>
            <button @click="moveToDown">下移</button>
            <button @click="moveToHNU">移到湖南大学</button>
            <button @click="zoomIn">放大</button>
            <button @click="zoomOut">缩小</button>
        </div>
        <div> 
            <input id="daddress" type="text" value='长沙市岳麓区登高路'>
            <input id='lnglat' disabled type="text">
            <!-- <input id="geo" type="button" @click="geoCode" class="btn" value="地址 -> 经纬度" /> -->
            <!-- <button @click="geoCode">地址--经纬度</button> -->
        </div>
    </div>
</template>

<script>

import 'ol/ol.css'
import View from 'ol/View'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import  {transform} from 'ol/proj'
import XYZ from "ol/source/XYZ"
import {OSM, TileArcGISRest} from 'ol/source'
import { defaults as defaultControls, FullScreen } from "ol/control"
import MousePosition from "ol/control/MousePosition";
import {ScaleLine} from "ol/control";
import {ZoomSlider} from 'ol/control'
//投影坐标系转换依赖
import { fromLonLat } from "ol/proj";
import {OverviewMap} from "ol/control"

import AMap from 'AMap'

export default {
    name:'HomeMapLoc',
    data() {
        return {
            mapMain: null,
            lngMain: 0,
            latMain: 0,
            markerMain: null,
            content: '',
            autocomplete: null,
            placeSearch: null,
            imap:"",
            view:null,
            layers:null,
            mmap:"",
            address:'',

            //  // 组件
            // autoCompleteComponent: undefined,
            // placeSearchComponent: undefined,

            // // marker点集合
            // markerList:[],
            // mapInput:'',
            // inputSearchVal:'',
        }
    },
    mounted(){
        var view=new View({
            // center:[116.40804291, 39.90367897],
            projection:'EPSG:3857',
            center:fromLonLat([116.40804291, 39.90367897]),           
            // projection:'EPSG:4326',
            zoom:10
        });
        this.view=view;

        var layers =new TileLayer({
            source: new XYZ({
                url:"http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
            })
        });
        this.layers=layers;

        
        //鹰眼控件
        var overviewMapControl = new OverviewMap({
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url:"http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
                    })
                })
            ]
        })
        

        this.imap = new Map({
            layers:[layers],
            view: view,
            controls: defaultControls({ zoom: 8 }).extend([overviewMapControl]),       
            target:'map'
        });
        this.imap.addControl(new FullScreen());
        this.imap.addControl(new ScaleLine());
        this.imap.addControl(new ZoomSlider());   

        //this.initAMapMain();
        
        //this.mmap.plugin(['AMap.Geocoder','AMap.Autocomplete']);
//         this.mmap = new AMap.Map('mapcon', {
//             resizeEnable:true
//         });
        var autoOptions = {
            city: "全国", //城市，默认全国
            input: "keyword"//使用联想输入的input的id
        };
        var autocomplete= new AMap.Autocomplete(autoOptions);
        AMap.event.addListener(autocomplete, "select", function(data){
            console.log(data.poi.name);
            this.address=data.poi.name;
            var mlng=data.poi.location.lng;
            var mlat=data.poi.location.lat;
            document.getElementById('lnglat').value = mlng+','+mlat;
            view.setCenter(fromLonLat([mlng,mlat]));
            view.setZoom(18);
        }); 
        // var placeSearch = new AMap.PlaceSearch({
        //     city:'全国',
        //     map:mmap,
        // });
    //     AMap.event.addListener(autocomplete, "select", function(e){
    //      //TODO 针对选中的poi实现自己的功能
    //      placeSearch.setCity(e.poi.adcode);
    //      placeSearch.search(e.poi.name);
    //      var mlng=e.poi.location.lng;
    //      var mlat=e.poi.location.lat;
    //      document.getElementById('lnglat').value = mlng+','+mlat;
    //      view.setCenter(fromLonLat([mlng,mlat]));
    //      view.setZoom(18);
    //   });
        

        
        
        // var mousePositionControl = new MousePosition({
        //     //坐标格式
        //     coordinateFormat: createStringXY(5),
        //     //地图投影坐标系（若未设置则输出为默认投影坐标系下的坐标）
        //     projection: "EPSG:4326",
        //     //坐标信息显示样式类名，默认是'ol-mouse-position'
        //     className: "custom-mouse-position",
        //     //显示鼠标位置信息的目标容器
        //     target: document.getElementById("mouse-position"),
        //     //未定义坐标的标记
        //     undefinedHTML: "&nbsp;"
        // });
        // map.addControl(mousePositionControl);
    },
    computed:{
        lnglat:function() {
            return this.lngMain+","+this.latMain
        }
    },
    methods: {
//         initAMapMain() {
//             this.mmap = new AMap.Map('mapcon', {
//                 resizeEnable:true
//             });
//             let autoOptions = {
//                 input:'inputContent',
//                 output:'show'
//             };
//             this.autocomplete = new AMap.Autocomplete(autoOptions);
//             this.placeSearch = new AMap.PlaceSearch({
//                 map:this.mapMain
//             });
//             this.placeSearch.search(this.content,(status,info)=>{
//                 console.log(status,info)
//             });
//             this.autocomplete.on('select',(e) => {
//                 this.placeSearch.setCity(e.poi.adcode)
//                 this.placeSearch.search(e.poi.name)
//             });
//         },
        // position:function(e) {
        //     let auto = new AMap.Autocomplete({
        //         input:"tipinput"
        //     });//input框输入提示
        //     this.placeSearch = new AMap.PlaceSearch({
        //         map:this.mmap
        //     });
        //     AMap.event.addListener(auto,'select',this.position);
        //     let geocoder = new AMap.Geocoder({
        //         city:'全国'
        //     });
        //     let marker =  new AMap.Marker();
        //     let str = e.poi ? `${e.poi.district}${e.poi.name}` : this.address;
        //     geocoder.getLocation(str, (status, result) => {
        //         if (status === "complete" && result.geocodes.length) {
        //             let lnglat = result.geocodes[0].location;
        //             this.location = lnglat;
        //             marker.setPosition(lnglat);
        //             this.mmap.add(marker);
        //             this.mmap.setFitView(marker);
        //         } else {
        //             this.$message.error("查询位置失败,请重新输入");
        //         }
        //     });
        // },
        //左移
        moveToLeft:function(e){
            var view=this.imap.getView();
            var mapCenter=view.getCenter();

            mapCenter[0]+=5000;
            view.setCenter(mapCenter);
            this.imap.render();
        },
        //右移
        moveToRight:function(e){
            var view=this.imap.getView();
            var mapCenter=this.view.getCenter();

            mapCenter[0]-=5000;
            view.setCenter(mapCenter);
            this.imap.render();
        },
        //上移
        moveToUp:function(e){
            var view=this.imap.getView();
            var mapCenter=this.view.getCenter();

            mapCenter[1]-=5000;
            view.setCenter(mapCenter);
            this.imap.render();
        },
        //下移
        moveToDown:function(e){
            var view=this.imap.getView();
            var mapCenter=this.view.getCenter();

            mapCenter[1]+=5000;
            view.setCenter(mapCenter);
            this.imap.render();
        },
        //移动到湖大
        moveToHNU:function(e){
            var view=this.imap.getView();
            // var mapCenter=this.view.getCenter();

            // mapCenter[0]+=10;
            view.setCenter(fromLonLat([112.94571877,28.17473905]));
            view.setZoom(17);
            this.imap.render();
        },
        //放大
        zoomIn: function(e){
            var view = this.imap.getView();
            // 让地图的zoom增加1，从而实现地图放大
            view.setZoom(view.getZoom() + 1);
        },
        //缩小
        zoomOut: function(e){
            var view = this.imap.getView();
            // 让地图的zoom增加1，从而实现地图缩小
            view.setZoom(view.getZoom() - 1);
        },
        searchKeyword: function(e) {           
            var view = this.imap.getView();
            //AMap.plugin('AMap.Geocoder');
            var geocoder = new AMap.Geocoder();
            //var marker = new AMap.Marker();
            var address = document.getElementById('keyword').value;

            // var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
            //     pageSize: 5,
            //     pageIndex: 1,
            //     city: "全国"//城市
            // });
            // //关键字查询
            // placeSearch.search('方恒', function(status, result) {
            // //TODO:开发者使用result自己创建交互面板和地图展示
            // });
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
#map{
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