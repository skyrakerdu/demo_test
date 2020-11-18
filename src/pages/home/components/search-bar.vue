<template>
  <div class='search-div'>
    <el-input id='keyword' v-model='address' name='keyword' placeholder="请输入关键字">
      <el-button slot="append" icon="el-icon-search" @click="SearchKeyword"> </el-button>
    </el-input>
  </div>
</template>

<script>
import AMap from 'AMap'
export default {
  name:'SearchBar',
  data(){
    return{
      coordinate:[],
      address:'',
    }
  },
  mounted(){
    this.RelatedSearch();
  },
  methods:{

    //搜索框事件
    RelatedSearch:function() {
      var that = this;
      //var view= this.map.getView();
      var geocoder = new AMap.Geocoder();
      //var address = document.getElementById(inputid).value;
      var autoOptions = {
        city:'全国',
        input:keyword
      };
      var autocomplete = new AMap.Autocomplete(autoOptions);
      AMap.event.addListener(autocomplete, "select", function(data){
        that.address=data.poi.name;
        //console.log(data.poi.name);
        //document.getElementById(keyword).value=data.poi.name;
        that.coordinate=[data.poi.location.lng,data.poi.location.lat];
        // var mlng=data.poi.location.lng;
        // var mlat=data.poi.location.lat;
        // address.location.lng=mlng;
        // address.location.lat=mlat;
        // document.getElementById('lnglat').value = mlng+','+mlat;
        // view.setCenter(fromLonLat([mlng,mlat]));
        // view.setZoom(18);
      });
      //that.$emit('RelatedSearch',that.coordinate);
    },

    //搜索地址
    SearchKeyword: function(e) {     
      var that = this;      
      //var view = this.map.getView();
      var geocoder = new AMap.Geocoder();
      //var marker = new AMap.Marker();
      var address = document.getElementById('keyword').value;
      geocoder.getLocation(address,function(status,result)  {
        if (status === 'complete'&&result.geocodes.length) {
          that.coordinate=[result.geocodes[0].location.lng,result.geocodes[0].location.lat]
          // var lng = result.geocodes[0].location.lng;
          // var lat = result.geocodes[0].location.lat;
          // document.getElementById('lnglat').value = lng+','+lat;
          //   view.setCenter(fromLonLat([lng,lat]));
          //   view.setZoom(18);
        } else {
          log.error('地址查询位置失败');
        }
      });
      that.$emit('SearchKeyword',that.coordinate);
    },
  }
}
</script>

<style scoped>
.search-div {
  position: absolute;
  display: flex;
  align-items: center;
  right: 28px;
  top: 30px;
  width: 300px;
  height: 40px;
  box-sizing: border-box;
}
</style>