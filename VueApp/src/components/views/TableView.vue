<script lang="ts">
import {defineComponent, inject, onMounted, ref, watch} from "vue";
import type {Header, ServerOptions} from "vue3-easy-data-table";
import {useMenuStore} from "@/stores/menu";
import {storeToRefs} from "pinia";
import {SearchService} from "@/services/searchService";

export default defineComponent({
  setup() {


    //Variables
    const serverOptions = ref<ServerOptions>({page: 1, rowsPerPage: 25,});
    const serverItemsLength = ref(0);
    const menuStore = useMenuStore()
    const {searchFilter} = storeToRefs(menuStore)
    const {submitIncrement} = storeToRefs(menuStore)
    const searchResults = ref<any[]>([]);

    const headers: Header[] = [
      { text: "Notification Number", value: "notification_number" },
      { text: "Reference Number", value: "reference_number" },
      { text: "Creation Timestamp", value: "creation_timestamp" },
      { text: "Completion Timestamp", value: "completion_timestamp" },
      { text: "Directorate", value: "directorate" },
      { text: "Department", value: "department" },
      { text: "Branch", value: "branch" },
      { text: "Section", value: "section" },
      { text: "Code Group", value: "code_group" },
      { text: "Code", value: "code" },
      { text: "Cause Code Group", value: "cause_code_group" },
      { text: "Cause Code", value: "cause_code" },
      { text: "Official Suburb", value: "official_suburb" },
      { text: "Latitude", value: "latitude" },
      { text: "Longitude", value: "longitude" },
      { text: "H3 Level8 Index", value: "h3_level8_index" },
    ];


    // Methods
    onMounted(async () => {
      searchResults.value = await new SearchService().search(searchFilter.value);
    })


    // On load
    watch(submitIncrement, async (newValue, oldValue) => {
      searchResults.value = await new SearchService().search(searchFilter.value);
    })


    return {
      serverOptions,
      headers,
      searchResults
    };
  }
});
</script>

<template>
 <div class="m-6 overflow-x-hidden overflow-y-visible h-[95vh]">
    <h1 class="text-2xl mb-8 text-center text-city-dark-blue font-semibold">Search Results:  {{serverOptions}}</h1>
   <EasyDataTable
       v-model:server-options="serverOptions"
       :server-items-length="serverItemsLength"
       :key="JSON.stringify({ ...userserverOptions })"
       buttons-pagination
       :headers="headers"
       :items="searchResults"
       theme-color=""
       table-class-name="custom-easy-table"
       header-item-class-name="bg-red"
       body-row-class-name=""
       :rowsItems="[25, 100, 250]"
   >
   </EasyDataTable>
 </div>
</template>

<style scoped>

.vue3-easy-data-table {
  overflow: hidden; display: flex; flex-direction: column;
  .vue3-easy-data-table__main { flex-grow: 1; flex: 1 1 0%; }
}

body
{
  overflow-x: scroll;
}
</style>
