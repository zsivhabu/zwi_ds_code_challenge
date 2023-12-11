<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import "leaflet/dist/leaflet.css";
import {LMap, LMarker, LPolygon, LPopup, LTileLayer} from "@vue-leaflet/vue-leaflet";
import {MapService} from "@/services/mapService";
import {storeToRefs} from "pinia";
import {useMenuStore} from "@/stores/menu";

export default defineComponent({
  components: {LPolygon, LPopup, LMarker, LMap, LTileLayer,},
  setup() {


    //Variables
    const zoom = ref(12);
    const menuStore = useMenuStore()
    const {h3Blocks} = storeToRefs(menuStore)

    onMounted(async () => {
      if (h3Blocks.value.length == 0)
      {
       // h3Blocks.value = await new MapService().getH3Blocks();
       // menuStore.setH3Blocks(h3Blocks.value)
      }
    })


    return {
      zoom,
      h3Blocks
    };
  }
});
</script>

<template>
      <l-map ref="map" style="height: 100vh; width: 100vw" v-model:zoom="zoom" :center="[-33.9925058,18.5607508]" >
        <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
        ></l-tile-layer>
      </l-map>

<!--  <l-map ref="map" style="height: 100vh; width: 100vw" v-model:zoom="zoom" :center="[-33.9925058,18.5607508]">
    <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
    ></l-tile-layer>

    <l-polygon
        v-for="(block, index) in h3Blocks"
        :key="index"
        :lat-lngs="[block.latitude, block.longitude]"
        :options="{ color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }"
    ></l-polygon>
  </l-map>-->


</template>

<style scoped>


</style>
