<script lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";
import {ChartService} from "@/services/chartService";
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from 'chart.js'
import { Bar } from 'vue-chartjs'
import zoomPlugin from "chartjs-plugin-zoom";
import SLDirectorate from "@/components/selectlist/SLDirectorate.vue";
import {useMenuStore} from "@/stores/menu";
import {storeToRefs} from "pinia";
import {useSelectLists} from "@/stores/selectLists";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(zoomPlugin)

export default defineComponent({
  components: {SLDirectorate, Bar},
  setup() {

    //Variables
    const suburbIncidentsByDirectorate = ref<any[]>([]);
    const chartSuburbIncidentsByDirectorateReady = ref(false);

    const directorateAggregated = ref<any[]>([]);
    const perDirectorateReady = ref(false);
    const menuStore = useMenuStore()
    const selectListStore = useSelectLists()
    const {directorateList} = storeToRefs(selectListStore)
    const {selectedDirectorate} = storeToRefs(menuStore)
    const keya = ref(0)

    onMounted(async () => {
      suburbIncidentsByDirectorate.value = await new ChartService().suburbIncidentsByDirectorate();
      chartSuburbIncidentsByDirectorateReady.value = true;

      directorateAggregated.value = await new ChartService().directorateAggregated(selectedDirectorate.value);
      perDirectorateReady.value = true;
    })

    watch(selectedDirectorate, async (newValue, oldValue) => {
      keya.value = keya.value + 1;
      directorateAggregated.value = await new ChartService().directorateAggregated(newValue);
      perDirectorateReady.value = true;
    })

    return {
      suburbIncidentsByDirectorate,
      chartSuburbIncidentsByDirectorateReady,
      selectedDirectorate,
      perDirectorateReady,
      directorateAggregated,
      directorateList,
      keya,
      options: {
        responsive: true,
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
            }
          }
        }
      }
    };
  }
});
</script>

<template>

<div class="p-4 overflow-y-visible overflow-x-hidden">
  <tabs >
    <tab key="keya" name="Predefined Charts">

      <div class="chart-container">

        <h1 class="mb-4  font-extrabold leading-none tracking-tight  text-city-dark-blue">1. Incidents by Directorate</h1>
        <p class="mb-6 text-lg font-normal  lg:text-xl text-city-pink">This chart shows the number of incidents per directorate. Select a Directorate</p>
        
        <v-select :teleport="true" v-model="selectedDirectorate" :options="directorateList" :clearable="false"   class=" mb-2" ></v-select>

        <Bar v-if="perDirectorateReady" :data="directorateAggregated" :options="options" />

        <div class="relative flex py-5 items-center">
          <div class="flex-grow border-t border-gray-400"></div>
          <span class="flex-shrink mx-4 text-city-dark-blue"><i class="bi bi-arrow-down"></i></span>
          <div class="flex-grow border-t border-gray-400"></div>
        </div>

      </div>

      <!-- Chart 2 -->
      <div class="chart-container">

        <h1 class="mb-4  font-extrabold leading-none tracking-tight  text-city-dark-blue">2. Suburbs Incidents by Directorate</h1>
        <p class="mb-6 text-lg font-normal  lg:text-xl text-city-pink">This chart shows the number of incidents per suburb by directorate.</p>


        <Bar v-if="chartSuburbIncidentsByDirectorateReady" :data="suburbIncidentsByDirectorate" :options="options" />

        <div class="relative flex py-5 items-center">
          <div class="flex-grow border-t border-gray-400"></div>
          <span class="flex-shrink mx-4 text-city-dark-blue"><i class="bi bi-arrow-down"></i></span>
          <div class="flex-grow border-t border-gray-400"></div>
        </div>

      </div>

    </tab>
    <tab name="Custom Charts">
        To be implemented in future - A nice complex chart that can be configured by the user.
    </tab>
  </tabs>

</div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
