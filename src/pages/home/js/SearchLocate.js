import AMap from 'AMap'
import {fromLonLat} from 'ol/proj';
import View from 'ol/View'

export default {
  searchlocate(keyword,lnglat) {
    var address='';
    var geocoder = new AMap.Geocoder();
    //var address = document.getElementById(inputid).value;
    var autoOptions = {
      city:'全国',
      input:keyword
    };
    var autocomplete = new AMap.Autocomplete(autoOptions);
    AMap.event.addListener(autocomplete, "select", function(data){
      address=data.poi.name;
      console.log(data.poi.name);
      //document.getElementById(keyword).value=data.poi.name;
      var mlng=data.poi.location.lng;
      var mlat=data.poi.location.lat;
      // address.location.lng=mlng;
      // address.location.lat=mlat;
      lnglat.innerHTML = '&nbsp'+ mlng+','+mlat;
    });
    return address;
  }
}