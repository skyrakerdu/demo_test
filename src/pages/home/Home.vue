<template>
    <!-- <HomeMap /> -->
    <!-- <HomeDoubleMap /> -->
    <!-- <HomeMapLoc /> -->
    <!-- <HomeMapJson /> -->
    <!-- <HomeSelectFeatures /> -->
    <!-- <HomeGaoMap /> -->
    <!-- <HomeSimpleSearch /> -->
    <!-- <HomeMapSearch /> -->
    <!-- <HomeMohu /> -->
    <RootComponent />
</template>

<script>
import HomeMap from './components/Map'
import HomeDoubleMap from './components/DoubleMap'
import HomeMapLoc from './components/MapLoc'
import HomeMapJson from './components/MapJson'
import HomeSelectFeatures from './components/SelectFeatures'
import HomeGaoMap from './components/GaoMap'
import HomeSimpleSearch from './components/SimpleSearch'
import HomeMapSearch from './components/MapSearch'
import HomeMohu from './components/mohusousuo'
import RootComponent from './components/root-component'
export default {
   name: 'Home',
   components: {
       HomeMap:HomeMap,
       HomeDoubleMap:HomeDoubleMap,
       HomeMapLoc:HomeMapLoc,
       HomeMapJson:HomeMapJson,
       HomeSelectFeatures:HomeSelectFeatures,
       HomeGaoMap:HomeGaoMap,
       HomeSimpleSearch:HomeSimpleSearch,
       HomeMapSearch:HomeMapSearch,
       HomeMohu:HomeMohu,
       RootComponent:RootComponent
   }
}
</script>

<style scoped>

</style>