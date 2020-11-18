<template>
  <div id="app">
    <el-input id="keyword" v-model="address" name="keyword" placeholder="搜索你想去的地方"/>
   <div id='container' ></div>
  </div>
</template>
 
<script>
export default {
name: 'test',
data () {
return {
    map: null,
    address:''
}
},
mounted () {
    var windowsArr = [];
    var marker = [];
    var map = new AMap.Map("container", {
            resizeEnable: true,
            center: [120.211877, 30.255194],//地图中心点
            zoom: 13,//地图显示的缩放级别
            keyboardEnable: false
    });
    AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
      var autoOptions = {
        city: "杭州", //城市，默认全国
        input: "keyword"//使用联想输入的input的id
      };
      var autocomplete= new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
            city:'杭州',
            map:map
      })
      AMap.event.addListener(autocomplete, "select", function(e){
         //TODO 针对选中的poi实现自己的功能
         placeSearch.setCity(e.poi.adcode);
         placeSearch.search(e.poi.name);
         console.log('经度',e.poi.location.lng);
         console.log('纬度',e.poi.location.lat);
      });  
    });
}
    
}
</script>
 
<style scoped>
#container{
    width: 400px;
    height: 400px;
}
</style>