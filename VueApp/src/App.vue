<script lang="ts">
import {defineComponent} from "vue";
import {storeToRefs} from "pinia";
import {useGlobalLoader} from "@/stores/globalLoader";
import SideBar from "@/components/SideBar.vue";
import CurrentRouterView from "@/components/CurrentRouterView.vue";

export default defineComponent({
  components: {CurrentRouterView, SideBar},
  setup: function () {
    const globalLoader = useGlobalLoader()
    const {loading} = storeToRefs(globalLoader)

    return {
      loading
    }
  },
});
</script>

<template>
  <div v-if="loading" class="loader-overlay">
    <div class="loader"></div>
  </div>
  <SideBar />
  <CurrentRouterView />
</template>

<style scoped>

</style>
