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

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid rgb(30,31,118);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
