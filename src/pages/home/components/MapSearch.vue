<template>
  <div class="app-container">
    <div id="title">高德地图组件展示</div>
    <div id="searchDiv">
          <el-input id="inputContent"
                    v-model="content"
                    placeholder="请输入关键字"></el-input>
          <div style="width:30%"
               id="show"></div>
        </div>
    <div id="mapcontainer"></div>
    <div id="lnglat">
      <input type="text" style="height:30px;width:260px;text-align:center;font-size:16px" v-model="lnglat">
    </div>
    <div id="footer"></div>
  </div>
</template>
<script>
//import location from "@/assets/image/location.png";
export default {
  data() {
    return {
      mapMain: null,
      lngMain: 0,
      latMain: 0,
      markerMain: null,
      content: '',
      autocomplete: null,
      placeSearch: null
    };
  },
  created() {},
  mounted() {
    this.initMapMain();
  },
  
computed:{
    lnglat: function(){
      return this.lngMain + "," + this.latMain //计算属性，根据动态的坐标值随时获取新结果
    }
  },
  methods: {
    initMapMain() {
      //地图组件绑定div进行初始化并赋值给vue的对象
      this.mapMain = new AMap.Map("mapcontainer", {
        center: [this.lngMain, this.latMain], //设置显示的地图中心坐标
        zoom: 8 //设置地图缩放等级
      });
      //绑定地图组件内单击事件
      this.mapMain.on('click', (e) => {
        //去除已经添加的自定义图标
        if (this.markerMain != null) {
          this.mapMain.remove(this.markerMain)
        }
        let lng = e.lnglat.getLng()
        let lat = e.lnglat.getLat()
        this.lngMain = lng
        this.latMain = lat
        this.drawPoint(lng,lat)
    });
 
      //添加地图关键字检索和根据关键字定位插件
      let This = this
      AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
        let autoOptions = {
          input: 'inputContent',
          output: 'show'
        }
        This.autocomplete = new AMap.Autocomplete(autoOptions)
        This.placeSearch = new AMap.PlaceSearch({
          map: This.mapMain
        })
      })
      this.placeSearch.search(this.content, (status, info) => {
        console.log(status, info)
      })
      this.autocomplete.on('select', (e) => {
        this.placeSearch.setCity(e.poi.adcode)
        this.placeSearch.search(e.poi.name)
      })
    },
    drawPoint (lng, lat) {
      let icon = new AMap.Icon();
      this.markerMain = new AMap.Marker({
        icon: icon,
        position: [lng, lat],
        offset: new AMap.Pixel(-15, -30),
        draggable: true
      })
      this.markerMain.setMap(this.mapMain)
      this.markerMain.on('dragend', e => {
        this.lngMain = e.lnglat.lng
        this.latMain = e.lnglat.lat
      })
    }
  }
};
</script>
<style scoped>
#mapcontainer {
  height: 300px;
  width: 500px;
  font-size: 13px;
}
#searchDiv {
  position: absolute !important;
  z-index: 99 !important;
  margin-left: 19%;
  margin-top: 2%;
  width: 19%;
}
#inputContent {
  width: 85%;
}
#show {
  width: 85% !important;
  visibility: visible;
  background-color: white;
}
</style>