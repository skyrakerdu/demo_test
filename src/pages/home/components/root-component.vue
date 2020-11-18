<template>
	<div style="width:100%;height:930px">
		<InitMap  ref='map' :zoom='myzoom'></InitMap>
		<SearchBar ref='search' @SearchKeyword='rootSearchKeyword' ></SearchBar>
		<QueryWfs ref='wfs' @InitWfs='rootInitWfs' ></QueryWfs>
		<ToolBar></ToolBar>
		<!-- <TextView /> -->
	</div>
</template>

<script>
import InitMap from './init-map.vue'
import SearchBar from './search-bar.vue'
import QueryWfs from './query-wfs.vue'
import ToolBar from './tool-bar.vue'
//import TextView from './textview.vue'
export default {
	name:'RootComponent',
	data(){
		return{
			myzoom:15,
			//center:[0,0]
		}
	},
  components: {
		InitMap,
		SearchBar,
		QueryWfs,
    ToolBar,
		//TextView
	},
	methods:{
		// rootRelatedSearch(data) {
		// 	//console.log(data);
		// 	this.$refs.map.changeViewCenter(data);
		// },
		rootSearchKeyword(data) {
			this.$refs.map.changeViewCenter(data);
		},

		rootInitWfs(data) {
			if(data){
				this.$refs.map.customizedLayerControl('remove',data);
				this.$refs.map.customizedLayerControl('add',data);
			} else {
				this.$refs.map.customizedLayerControl('remove',data);
				this.$refs.map.customizedLayerControl('add',data);
			}
		},

		rootLayer(type,data) {
			this.$refs.map.customizedLayerControl(type,data);
		},

		rootInteraction(type,data) {
			this.$refs.map.customizedInteractionControl(type,data);
		},

		rootReloadWfs(){
			console.log("here is rootReloadWfs!");
			this.$refs.wfs.initWfs();
		}
	}
}
</script>

<style scoped>

</style>