<script lang="ts">
import {defineComponent} from "vue";
import {useMenuStore} from "@/stores/menu";
import {storeToRefs} from "pinia";

export default defineComponent({
  setup() {
    const menuStore = useMenuStore()
    const {isSidebarHidden} = storeToRefs(menuStore)
    return {
      isSidebarHidden
    };
  }
});

</script>

<template>
  <div id="content" class="" :class="{ 'content-maximized': isSidebarHidden, 'content-minimized': !isSidebarHidden }">
      <router-view></router-view>
  </div>
</template>

<style>

</style>