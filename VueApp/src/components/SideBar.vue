<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {useMenuStore} from "@/stores/menu";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import SLDirectorate from "@/components/selectlist/SLDirectorate.vue";
import SLDepartment from "@/components/selectlist/SLDepartment.vue";
import SLBranch from "@/components/selectlist/SLBranch.vue";
import SLCode from "@/components/selectlist/SLCode.vue";
import SLCauseCodeGroup from "@/components/selectlist/SLCauseCodeGroup.vue";
import SLCauseCode from "@/components/selectlist/SLCauseCode.vue";
import SLOfficialSuburb from "@/components/selectlist/SLOfficialSuburb.vue";
import SLHexId from "@/components/selectlist/SLHexId.vue";

export default defineComponent({
  components: {SLHexId, SLOfficialSuburb, SLCauseCode, SLCauseCodeGroup, SLCode, SLBranch, SLDepartment, SLDirectorate},
  setup() {

    //Variables
    const menuStore = useMenuStore()
    const {isSidebarHidden} = storeToRefs(menuStore)
    const {routeName} = storeToRefs(menuStore)
    const {isHideSelectFilters} = storeToRefs(menuStore)
    const {searchFilter} = storeToRefs(menuStore)
    const useRoute = useRouter()

    // Methods
    function toggleSidebar() {
      menuStore.toggleSidebar()
    }


    function setRouteName(routeName: string) {
      menuStore.setRouteName(routeName)
    }

    function toggleSelectFilters() {
      menuStore.toggleSelectFilters()
    }

    function filter() {
      menuStore.incrementSubmit()
    }

    // On load
    onMounted(() => {
      useRoute.isReady().then(() => {
        menuStore.setRouteName(useRoute.currentRoute.value.name as string)
      });
    });

    return {
      isSidebarHidden,
      setRouteName,
      routeName,
      toggleSidebar,
      isHideSelectFilters,
      toggleSelectFilters,
      searchFilter,
      filter
    };
  }
});

</script>

<template>
  <span class="absolute text-white text-4xl top-5 left-4 cursor-pointer z-40" @click="toggleSidebar()">
      <i class="bi bi-filter-left px-2 bg-gray-900 rounded-md"></i>
  </span>
  <div id="sidebar"  :class="{ 'sidebar-hidden': isSidebarHidden, 'sidebar-open' : !isSidebarHidden }" class=" fixed top-0 bottom-0 lg:left-0 p-2 z-50  w-[80%] md:w-[400px]   text-center bg-city-dark-blue">
    <div class="text-gray-100 text-xl">
      <div class="p-2.5 mt-1 flex items-center" >
        <span class="ml-3"><img class="w-full" src="@/assets/logo/logo-alternate.png" alt=""/></span>
        <i class="bi bi-x scale-150  cursor-pointer ml-28 " @click="toggleSidebar()"></i>
      </div>
      <div class="my-2 bg-gray-600 h-[1px]"></div>
    </div>
    <div class="pt-2.5 mt-3 flex items-center rounded-md px-4 duration-900 text-white">
      <h1 class="text-[20px] text-white font-bold">Data Display Type</h1>
    </div>
    <RouterLink @click="setRouteName('map')" to="/map"  :class="{'active-menu' : routeName == '' || routeName == 'map'}"  class="p-1.5 mt-3 flex items-center rounded-md px-4 duration-900 cursor-pointer hover:bg-city-pink text-white">
      <i class="bi bi-geo-alt-fill"></i>
      <span class="text-[15px] ml-4 text-gray-200 font-bold" >Map View</span>
    </RouterLink>
    <RouterLink @click="setRouteName('table')" to="/table" :class="{'active-menu' : routeName == 'table' }"  class="p-1.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-city-pink text-white">
      <i class="bi bi-table"></i>
      <span  class="text-[15px] ml-4 text-gray-200 font-bold" >Table View</span>
    </RouterLink>
    <RouterLink @click="setRouteName('chart')"  to="/chart" :class="{'active-menu' : routeName == 'chart' }"  class="p-1.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-city-pink text-white">
      <i class="bi bi-graph-up"></i>
      <span class="text-[15px] ml-4 text-gray-200 font-bold">Chart View</span>
    </RouterLink>

    <div class="my-4 bg-gray-600 h-[1px]"></div> <!-- Divider -->

    <div  v-if=" routeName != 'chart'"  class="pt-2.5 mt-3 flex items-center rounded-md px-4 duration-900 text-white">
      <h1 class="text-[20px] text-white font-bold">Filters</h1>
      <small class="ml-4 mr-6 right-0 absolute text-10px">Leave blank fields if not applicable</small>
    </div>

    <!-- Table and Map Filters -->
    <div v-if=" routeName != 'chart'" class="">
      <div class="pt-2.5 mt-3 flex">
          <div class="w-1/2">
              <div class="items-center pl-1 pr-2 duration-900 text-white">
                <div class="relative float-label-input">
                  <!-- Add placeholder if you need floating effect -->
                  <input type="text"  class="block bg-city-dark-blue w-full focus:outline-none focus:shadow-outline border border-city-pink rounded-md py-3 px-3
                  appearance-none leading-normal" v-model="searchFilter.notificationNumber">
                  <label class="absolute top-3 left-0 text-white pointer-events-none transition duration-200 ease-in-outbg-white px-2">Notification Number</label>
                </div>
              </div>
          </div>
          <div class="w-1/2">
            <div class="items-center pl-1 pr-2 duration-900 text-white">
              <div class="relative float-label-input">
                <input type="text" class="block bg-city-dark-blue w-full focus:outline-none focus:shadow-outline border border-city-pink rounded-md py-3 px-3
                  appearance-none leading-normal"  v-model="searchFilter.referenceNumber">
                <label class="absolute top-3 left-0 text-white pointer-events-none transition duration-200 ease-in-outbg-white px-2">Reference Number</label>
              </div>
            </div>
          </div>
      </div>

      <div class="pt-2.5 mt-3 flex">
        <div class="w-[100%]">
          <div class="items-center pl-1 pr-2 duration-900 text-white">
            <div class="relative float-label-input-always">
              <VueDatePicker :enable-time-picker="false"  class="block input-dark bg-city-dark-blue w-full focus:outline-none focus:shadow-outline border border-city-pink rounded-md py-3 px-3 appearance-none leading-normal"
                             input-class-name="input-dark"
                             range multi-calendars :teleport="true"  />
              <label class="absolute top-3 left-0 text-white pointer-events-none transition duration-200 ease-in-outbg-white px-2">Date Logged</label>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-2.5 mt-3 flex">
        <div class="w-[100%]">
          <div class="items-center pl-1 pr-2 duration-900 text-white">
            <div class="relative float-label-input-always">
              <VueDatePicker :enable-time-picker="false"  class="block input-dark bg-city-dark-blue w-full focus:outline-none focus:shadow-outline border border-city-pink rounded-md py-3 px-3 appearance-none leading-normal"
                             input-class-name="input-dark"
                             range multi-calendars :teleport="true"  />
              <label class="absolute top-3 left-0 text-white pointer-events-none transition duration-200 ease-in-outbg-white px-2">Date Completed</label>
            </div>
          </div>
        </div>
      </div>

      <!--- Select Lists -->
      <div :class="{'hidden-select-filters' : isHideSelectFilters, 'show-select-filters' : !isHideSelectFilters}">
        <div class="">
          <div class="pt-2.5 mt-3 flex">
            <div class="w-1/2">
              <div class="">
                <div class="w-[100%]">
                  <div class="items-center pl-1 pr-2 duration-900 text-white">
                    <div class="relative float-label-input-always">
                      <s-l-directorate class="input-dark" :include-default-select-option="true" v-model="searchFilter.directorate" :modal-value="searchFilter.directorate" ></s-l-directorate>
                      <label class="absolute top-3 left-0 text-white pointer-events-none transition duration-200 ease-in-outbg-white px-2">Directorate</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-1/2">
              <div class="">
                <div class="w-[100%]">
                  <div class="items-center pl-1 pr-2 duration-900 text-white">
                    <div class="relative float-label-input-always">
                      <s-l-department class="input-dark" :include-default-select-option="true" v-model="searchFilter.department" :modal-value="searchFilter.department" ></s-l-department>
                      <label class="absolute top-3 left-0 text-white pointer-events-none transition duration-200 ease-in-outbg-white px-2">Department</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="">
          <div class="pt-2.5 mt-3 flex">
            <div class="w-1/2">
              <div class="">
                <div class="w-[100%]">
                  <div class="items-center pl-1 pr-2 duration-900 text-white">
                    <div class="relative float-label-input-always">
                      <s-l-branch class="input-dark" :include-default-select-option="true" v-model="searchFilter.branch" :modal-value="searchFilter.branch" ></s-l-branch>
                      <label class="absolute top-3 left-0 text-white pointer-events-none transition duration-200 ease-in-outbg-white px-2">Branch</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-1/2">
              <div class="">
                <div class="w-[100%]">
                  <div class="items-center pl-1 pr-2 duration-900 text-white">
                    <div class="relative float-label-input-always">
                      <s-l-code class="input-dark" :include-default-select-option="true" v-model="searchFilter.code" :modal-value="searchFilter.code" ></s-l-code>
                      <label class="absolute top-3 left-0 text-white pointer-events-none transition duration-200 ease-in-outbg-white px-2">Code</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="">
          <div class="pt-2.5 mt-3 flex">
            <div class="w-1/2">
              <div class="">
                <div class="w-[100%]">
                  <div class="items-center pl-1 pr-2 duration-900 text-white">
                    <div class="relative float-label-input-always">
                      <s-l-cause-code-group class="input-dark" :include-default-select-option="true" v-model="searchFilter.causeCodeGroup" :modal-value="searchFilter.causeCodeGroup" ></s-l-cause-code-group>
                      <label class="absolute top-3 left-0 text-white pointer-events-none transition duration-200 ease-in-outbg-white px-2">Cause Code Group</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-1/2">
              <div class="">
                <div class="w-[100%]">
                  <div class="items-center pl-1 pr-2 duration-900 text-white">
                    <div class="relative float-label-input-always">
                      <s-l-cause-code class="input-dark" :include-default-select-option="true" v-model="searchFilter.code" :modal-value="searchFilter.code" ></s-l-cause-code>
                      <label class="absolute top-3 left-0 text-white pointer-events-none transition duration-200 ease-in-outbg-white px-2">Code</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="">
          <div class="pt-2.5 mt-3 flex">
            <div class="w-1/2">
              <div class="">
                <div class="w-[100%]">
                  <div class="items-center pl-1 pr-2 duration-900 text-white">
                    <div class="relative float-label-input-always">
                      <s-l-official-suburb class="input-dark" :include-default-select-option="true" v-model="searchFilter.officialSuburb" :modal-value="searchFilter.officialSuburb" ></s-l-official-suburb>
                      <label class="absolute top-3 left-0 text-white pointer-events-none transition duration-200 ease-in-outbg-white px-2">Suburb</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-1/2">
              <div class="">
                <div class="w-[100%]">
                  <div class="items-center pl-1 pr-2 duration-900 text-white">
                    <div class="relative float-label-input-always">
                      <s-l-hex-id class="input-dark" :include-default-select-option="true" v-model="searchFilter.hexId" :modal-value="searchFilter.hexId" ></s-l-hex-id>
                      <label class="absolute top-3 left-0 text-white pointer-events-none transition duration-200 ease-in-outbg-white px-2">H3 Level8 Index</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-if=" routeName != 'chart'" class="">
      <div class="pt-2.5 mt-3 flex">
        <div class="w-[100%]">
          <div class="">
            <div class="w-[100%]">
              <div class="items-center pl-1 pr-2 duration-900 text-white">
                <div @click="toggleSelectFilters" class="relative block bg-white text-city-pink w-full focus:outline-none focus:shadow-outline border border-city-pink rounded-md py-3 px-3  appearance-none leading-normal">
                    <a v-if="isHideSelectFilters" class="cursor-pointer select-none" >More Filters <span class="bi bi-plus-circle-fill ml-1"></span></a>
                    <a  v-if="!isHideSelectFilters" class="cursor-pointer select-none">Less Filters <span class="bi  bi-dash-circle-fill ml-1" ></span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div :class="{'mb-[20px]': !isHideSelectFilters, '': !isHideSelectFilters}"  class="pt-2.5 mt-3 flex">
        <div v-if=" routeName != 'chart'" class="w-[100%]">
          <div class="">
            <div class="w-[100%]">
              <div class="items-center pl-1 pr-2 duration-900 text-white">
                <div class="relative float-label-input-always">
                  <input type="button" class="bg-city-pink w-full cursor-pointer focus:outline-none border border-city-pink rounded-md py-3 px-3 " @click="filter" value="Apply">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isHideSelectFilters"  class="p-1.5 w-full mb-2  flex items-center px-4 duration-300 absolute bottom-0 left-0 text-white hidden-less-than-400px ">
      <a href="https://github.com/zsivhabu/zwi_ds_code_challenge/" target="_blank" class="text-[12px]">
        <i class="bi bi-github text-city-pink"></i>
        <span class="text-city-pink ml-4">CCT Service Request Dashboard By Zwi</span>
      </a>
    </div>
    <!-- End Table and Map Filters -->



  </div>
</template>

<style scoped>

.active-menu {
  background-color: var(--city-pink);
}

.hidden-select-filters {
  transition: transform 0.5s ease;
  display: none;
}

.show-select-filters {
  transition: transform 0.5s ease;
  display: block;
}

#sidebar, #content {
  transition: transform 0.5s ease;
}

.vs__dropdown-menu  {
  width: 1000px !important;
}

>>> {
  --vs-controls-color: #664cc3;
  --vs-border-color: #664cc3;

  --vs-dropdown-bg: #282c34;
  --vs-dropdown-color: #cc99cd;
  --vs-dropdown-option-color: #cc99cd;

  --vs-selected-bg: #664cc3;
  --vs-selected-color: #eeeeee;

  --vs-search-input-color: #eeeeee;

  --vs-dropdown-option--active-bg: #664cc3;
  --vs-dropdown-option--active-color: #eeeeee;
}

</style>