<template>
<div>
  <div id ='mapcon' class="mapcon"></div>
  <input id="address" type="text" value='长沙市岳麓区登高路'>
  <input id='lnglat' disabled type="text">
  <input id="geo" type="button" @click="geoCode" class="btn" value="地址 -> 经纬度" />
  <button @click="geoCode">地址--经纬度</button>
</div>
</template>

<script>
import AMap from 'AMap'
export default {
  name:'HomeGaoMap',
  data() {
    return {
      imap:""  //踩坑,初始化为null
    }
  },
  mounted() {
      var map = new AMap.Map('mapcon', {
      center: [116.40804291, 39.90367897], // [纬度，经度]
      resizeEnable: true,
      zoom: 15
      });
      this.imap=map;
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale','AMap.Geocoder'], function () {
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Scale());
      });
      
  },
  methods: {   
    geoCode: function(e) {
      var geocoder = new AMap.Geocoder();
      var marker = new AMap.Marker();
      var address = document.getElementById('address').value;
      // geocoder.getLocation(str, (status, result) => {
      //           if (status === "complete" && result.geocodes.length) {
      //               let lnglat = result.geocodes[0].location;
      //               this.location = lnglat;
      //               marker.setPosition(lnglat);
      //               this.mmap.add(marker);
      //               this.mmap.setFitView(marker);
      //           } else {
      //               this.$message.error("查询位置失败,请重新输入");
      //           }
      //       });
      geocoder.getLocation(address,(status,result) => {
        if (status === 'complete'&&result.geocodes.length) {
          var lnglat = result.geocodes[0].location;
          document.getElementById('lnglat').value = lnglat;
          marker.setPosition(lnglat);
          this.imap.add(marker);
          this.imap.setFitView(marker);
          this.imap.setCenter(lnglat);
        } else {
          log.error('地址查询位置失败');
        }
      });
    },
  }
}
</script>

<style lang='stylus' scoped>
.mapcon {
  width:100%;
  height:850px;
}
</style>