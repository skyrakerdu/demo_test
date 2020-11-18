<template>
  <div id="toolbar">
    <el-button-group>
      <el-button ref="add" type="primary" plain icon="el-icon-plus" @click="addAction"></el-button>
      <el-button ref="select" type="primary" plain icon="el-icon-thumb" @click="selectAction"></el-button>
      <el-button ref="edit" type="primary" plain icon="el-icon-edit" @click="modifyAction"></el-button>
      <el-button ref="save" type="primary" plain icon="el-icon-upload" @click="saveAction"></el-button>
      <el-button ref="delete" type="primary" plain icon="el-icon-delete" @click="deleteAction"></el-button>
      <el-button ref="info" type="primary" plain icon="el-icon-info" @click="infoAction"></el-button>
      <el-button ref="refresh" type="primary" plain icon="el-icon-refresh" @click="refreshView"></el-button>
      <el-button ref="search" type="primary" plain icon="el-icon-search" @click="searchAction"></el-button>
      <el-button ref="location" type="primary" plain icon="el-icon-map-location" @click="myLocation"></el-button>
    </el-button-group>
  </div>
</template>

<script>
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import Feature from 'ol/Feature';
import {Style,Stroke} from 'ol/style';
import {Select,Modify,Draw} from 'ol/interaction';
import {transform} from 'ol/proj';
import {WFS} from 'ol/format';
export default {
  name:"",
  props:[],
  data() {
    return {
      newId:0,
      drawLayer:null,
      selectInteraction:null,
      modifyInteraction:null,
      drawInteraction:null,
      modifiedFeatures:null,
      drewFeature:null,
    }
  },
  mounted(){
    this.drawLayer = new VectorLayer({
      source:new Vector(),
      style :new Style({
        stroke:new Stroke({
          color:'red',
          width:2
        })
      }),
      zIndex:15, 
    });
    this.initInteraction();
    this.modifyInteraction.on('modifyend', this.modifyEnd);
    this.drawInteraction.on('drawend', this.drawEnd);

  },
  methods:{
    initInteraction(){
      if(this.selectInteraction) {
        this.$parent.rootInteraction('remove',this.selectInteraction);
        this.selectInteraction=null;
      }
      this.selectInteraction = new Select({
        style:new Style({
          stroke:new Stroke({
            color:'red',
            width:2
          })
        })
      });
      if(this.drawInteraction) {
        this.$parent.rootInteraction('remove',this.drawInteraction);
        this.drawInteraction=null;
      }
      this.drawInteraction = new Draw({
        type:'LineString',
        style:new Style({
          stroke:new Stroke({
            color:'red',
            width:5
          })
        }),
        source:this.drawLayer.getSource()
      });
      if(this.modifyInteraction) {
        this.$parent.rootInteraction('remove',this.modifyInteraction);
        this.modifyInteraction=null;
      }
      this.modifyInteraction = new Modify({
        style:new Style({
          stroke:new Stroke({
            color:'red',
            width:5
          })
        }),
        features:this.selectInteraction.getFeatures()
      });
    },

    addAction() {
      this.removeInteraction();      
      //this.$parent.rootInteraction('remove',this.drawInteraction);
      this.$parent.rootLayer('add',this.drawLayer);
      this.$parent.rootInteraction('add',this.drawInteraction);
    },
    drawEnd(e) {
      this.drewFeature = e.feature;
      console.log(this.drewFeature);
    },
    selectAction() {
      this.removeInteraction();
      this.$parent.rootInteraction('add',this.selectInteraction);
    },
    modifyAction() {
      this.removeInteraction();
      this.$parent.rootInteraction('add',this.selectInteraction);
      this.$parent.rootInteraction('add',this.modifyInteraction);
    },
    modifyEnd(e) {
      this.modifiedFeatures=e.features;
    },
    removeInteraction() {
      if(this.drewFeature) {
        this.drawLayer.getSource().removeFeature(this.drewFeature);
      }
      this.drewFeature=null;
      this.modifiedFeatures=null;
      console.log(this.$parent);
      this.$parent.rootInteraction('remove',this.drawInteraction);
      this.$parent.rootInteraction('remove',this.selectInteraction);
      this.$parent.rootInteraction('remove',this.modifyInteraction);
    }, 
    saveAction(){
      if (this.drewFeature){
        //console.log('here');
        this.onSaveNew();
      }
      if (this.modifiedFeatures){
        console.log("savemodifiy");
        this.onSaveModify();
      }
    },
    onSaveNew() {
      let geometry = this.drewFeature.getGeometry().clone();
      geometry.applyTransform(function (flatCoordinates,flatCoordinates2,stride){
        for(let j=0;j<flatCoordinates.length;j+=stride) {
          let temp=transform([flatCoordinates[j],flatCoordinates[j+1]],'EPSG:3857','EPSG:4326');
          flatCoordinates[j] = temp[0];
          flatCoordinates[j + 1] = temp[1];
        }
      });
      let newFeature = new Feature();
      //newFeature.setId('analog_pipe.new.' + this.newId);
      newFeature.setGeometryName('geom');
      newFeature.set('geom', null);
      newFeature.set('id', 100+this.newId);
      newFeature.set('pienum', 100+this.newId);
      newFeature.set('stapntnum', 99+this.newId*2);
      newFeature.set('endpntnum', 100+this.newId*2);
      newFeature.set('stapntlon', 112);
      newFeature.set('stapntlat', 28);
      newFeature.set('stapntalt', 100);
      newFeature.set('stapntdpt', 1);
      newFeature.set('endpntlon', 112);
      newFeature.set('endpntlat', 28);
      newFeature.set('endpntalt', 100);
      newFeature.set('endpntdpt', 1);
      newFeature.set('material', 'plastic');
      newFeature.set('inrpiedim', 0.1);
      newFeature.set('outpiedim', 1);
      newFeature.set('purpose', '');
      newFeature.set('status', '');
      newFeature.set('dsguni', '');
      newFeature.set('cstuni', '');
      newFeature.set('spvuni', '');
      newFeature.set('ownuni', '');
      newFeature.set('district', '');
      newFeature.set('findat', '');
      newFeature.setGeometry(geometry);
      console.log(newFeature);
      this.addWfs([newFeature]);
      this.newId+=1;
      setTimeout(() =>{
        this.drawLayer.getSource().clear();
        this.$parent.rootReloadWfs();
      },3000);
    },

    // 保存已经编辑的要素
    onSaveModify() {
      //如果修改的地图要素不为空
      //console.log("save wfs....0")
      if (this.modifiedFeatures && this.modifiedFeatures.getLength() > 0) {
        // 转换坐标
        let modifiedFeature = this.modifiedFeatures.item(0).clone();
        // 注意ID是必须，通过ID才能找到对应修改的feature
        modifiedFeature.setId(this.modifiedFeatures.item(0).getId());
        // 将EPSG：3857坐标转为EPSG：4326下的经纬度
        modifiedFeature.getGeometry().applyTransform(function (flatCoordinates, flatCoordinates2, stride) {
          for (let j = 0; j < flatCoordinates.length; j += stride) {
            let temp = transform([flatCoordinates[j],flatCoordinates[j + 1]],'EPSG:3857','EPSG:4326');
            flatCoordinates[j] = temp[0];
            flatCoordinates[j + 1] = temp[1];
          }
        });
        this.modifyWfs([modifiedFeature]);
        console.log(modifiedFeature);
      }
    },

    // 添加到服务器端
    addWfs(features) {
      let WFSTSerializer = new WFS();
      let featObject = WFSTSerializer.writeTransaction(features,
        null, null, {
          featureType: 'analog_pipe',
          featureNS: 'http://localhost:8080/geoserver/pipe',  // 注意这个值必须为创建工作区时的命名空间URI
          //featurePrefix: 'pipe',
          //srsName: 'EPSG:3857'      //参考坐标系
        });
      let serializer = new XMLSerializer();
      let featString = serializer.serializeToString(featObject);
      let request = new XMLHttpRequest();
      request.open('POST', 'http://localhost:8080/geoserver/pipe/ows?service=WFS');
      request.setRequestHeader('Content-Type', 'text/xml');
      request.send(featString);
    },
    
    // 把修改提交到服务器端
    modifyWfs(features) {
      console.log("save wfs....")
      let WFSTSerializer = new WFS();
      let featObject = WFSTSerializer.writeTransaction(null,
        features, null, {
          featureType: 'analog_pipe',
          featurePrefix: 'pipe',
          featureNS: 'http://localhost:8080/geoserver/pipe',  // 注意这个值必须为创建工作区时的命名空间URI
          //srsName: 'EPSG:3857'      //参考坐标系
        });
      // 转换为xml内容发送到服务器端
      let serializer = new XMLSerializer();
      let featString = serializer.serializeToString(featObject);
      let request = new XMLHttpRequest();
      request.open('POST', 'http://localhost:8080/geoserver/pipe/ows?service=WFS');
      // 指定内容为xml类型
      request.setRequestHeader('Content-Type', 'text/xml');
      request.send(featString);
    },
    

    deleteAction() {
      // 删选择器选中的feature
      if (this.selectInteraction.getFeatures().getLength() > 0) {
        this.deleteWfs([this.selectInteraction.getFeatures().item(0)]);
        // 3秒后自动更新features
        setTimeout(() => {
          this.selectInteraction.getFeatures().clear();
          this.$parent.rootReloadWfs();
          console.log("rootReloadWfs");
        }, 3000); 
      }
    },

    // 在服务器端删除feature
    deleteWfs(features) {
      let WFSTSerializer = new WFS();
      let featObject = WFSTSerializer.writeTransaction(null,
        null, features, {
          featureType: 'analog_pipe',
          featureNS: 'http://localhost:8080/geoserver/pipe',  // 注意这个值必须为创建工作区时的命名空间URI
          srsName: 'EPSG:3857'      //参考坐标系
        });
      let serializer = new XMLSerializer();
      let featString = serializer.serializeToString(featObject);
      let request = new XMLHttpRequest();
      console.log('start');
      request.open('POST', 'http://localhost:8080/geoserver/pipe/ows?service=WFS');
      console.log('succeed');
      request.setRequestHeader('Content-Type', 'text/xml');
      request.send(featString);
    },
  }

}
</script>

<style>
#toolbar {
  position: absolute;
  left: 28px;
  top: 50px;
}
</style>