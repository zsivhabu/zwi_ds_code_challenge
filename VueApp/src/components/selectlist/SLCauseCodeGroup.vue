<script lang="ts">

import {defineComponent} from "vue";
import {SelectListService} from "@/services/selectListService";
import {useSelectLists} from "@//stores/selectLists";
import GenericServerSelectList from "@/components/selectlist/GenericServerSelectList.vue";
import type {SelectOption} from "@/models/ui/selectOption";

export default defineComponent({
  components: {GenericServerSelectList},
  props: {
    modalValue: {
      type: Object as () => SelectOption,
      required: true,
      default: null,
    },
    onChange: {
      type: Function,
      required: false,
    }
  },
  setup: function (props) {

    const selectOptionsFromStore = useSelectLists().directorateList;
    const selectOptionsFromServer = new SelectListService().getDirectorateSelectList(false);

    return {
      selectOptionsFromStore,
      selectOptionsFromServer,
      modalValue: props.modalValue,
      onChange: props.onChange
    };
  },
});
</script>
<template>
  <generic-server-select-list
      :modal-value="modalValue"
      :on-change="onChange"
      :select-list-from-store="selectOptionsFromStore"
      :select-list-from-server="selectOptionsFromServer"
      store-method-name="directorateList"/>
</template>