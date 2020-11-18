<template>
  <div :style="conheight">
    <div style="height:100%;width:100%" id="container" width tabindex="0"></div>
    <div class="search-div" >
      <el-input id="tipInput" v-model="inputSearchVal" placeholder="请输入搜索名称">
        <el-button slot="append" icon="el-icon-search" @click="searchKeyword"> 
          搜索
        </el-button>
      </el-input>
    </div>
    
  </div>
</template>

<script>
import AMap from 'AMap'
export default {
  name: 'mapDetail',
  data () {
    return {
      // 地图map对象
      map: undefined,
      // 组件
      autoCompleteComponent: undefined,
      placeSearchComponent: undefined,

      // 样式
      conheight :{
        height: '600px',
        width: ''
      },
      // marker点集合
      markerList:[],
      mapInput:'',
      inputSearchVal:'',
      
    }
  },
  created(){
      window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy: function () {
      window.removeEventListener('resize', this.handleResize)
  },
  computed:{
      rightWidth(){
          let leftWidth = this.isCollapse ? '64' : '200';
          console.log(this.conheight.width)
          return (this.conheight.width-leftWidth)+'px'
      }
  },
  mounted () {
    this.init();
    this.addMarker();
    this.mapSearchInit();
  },
  methods: {
    /** 处理宽 */
    handleResize (event) {
        this.conheight.width = document.documentElement.clientWidth;
        this.conheight.height = document.documentElement.clientHeight;
        console.log(document.documentElement.clientHeight);
    },
    /** 初始化map对象 */
    init: function () {
      let map = new AMap.Map('container', {
        center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 15,
        lang: 'cn'
      })
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
      });
      this.map = map;
    },
    /** 打开marker消息窗体 */
    openInfo(positionResult,pointData) {
        var info = [];
        info.push("<div class='input-card content-window-card'>");
        info.push("<div style=\"padding:7px 0px 0px 0px;\"><h4>高德软件</h4>");
        info.push("<p class='input-item'>电话 : 010-84107000   邮编 : 100102</p>");
        info.push("<p class='input-item'>地址 :北京市朝阳区望京阜荣街10号首开广场4层</p></div></div>");

        let infoWindow = new AMap.InfoWindow({
            content: info.join(""),
            offset: new AMap.Pixel(10, -25)
        });
        infoWindow.open(this.map, positionResult.lnglat);
    },
    /** 添加marker */
    addMarker(){
      let that = this;
      var marker = new AMap.Marker({
          position: new AMap.LngLat(116.397428,39.90923), 
          title: '北京',
          extData: {id:'123456'}
      });
      //绑定点击事件
      marker.on('click',positionResult => {
        console.log(positionResult);
        let pointData = positionResult.target.getExtData();
        that.openInfo( positionResult ,pointData);
      });
      this.markerList.push(marker);
      this.map.add(this.markerList);
    },
    /** 初始化搜索工具 */
    mapSearchInit(){
      let that = this;
      // 绑定自动提示
      AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'], function(){
        var autoOptions = {
          input: "tipInput",
          city: '北京',
        }
        var autoCompleteComponent= new AMap.Autocomplete(autoOptions);
        // 监听选中项
        AMap.event.addListener(autoCompleteComponent,"select",function(data){
          console.log(data);
          if ( data.poi.location != undefined){
            //定位到中心点
            console.log("定位中心点")
            that.map.setCenter(data.poi.location);

            //TODO 获取数据，对数据进行操作如：添加marker等
            
          }
        
        })
        that.autoCompleteComponent = autoCompleteComponent;
        // 注册placeSearch组件
        that.placeSearchComponent = new AMap.PlaceSearch({
          // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          city: '北京'
        })
      });
    },
    /** 关键词搜索 */
    searchKeyword(){
      this.placeSearchComponent.search(this.inputSearchVal, function (status, result) {
        // 查询成功时，result即对应匹配的POI信息
        console.log(status);
        console.log(result);
      })
    }

  },
}
</script>

<style>
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