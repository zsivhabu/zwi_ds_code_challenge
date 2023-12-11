<script lang="ts">

import {defineComponent} from "vue";
import {SelectListService} from "@/services/selectListService";
import {useSelectLists} from "@//stores/selectLists";
import GenericServerSelectList from "@/components/selectlist/GenericServerSelectList.vue";

export default defineComponent({
  components: {GenericServerSelectList},
  props: {
    modalValue: {
      type: String,
      required: true,
      default: null,
    },
    onChange: {
      type: Function,
      required: false,
    }
  },
  setup: function (props) {

    const selectOptionsFromStore = useSelectLists().codeList;
    const selectOptionsFromServer = new SelectListService().getSelectOptions('code',true);

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
      store-method-name="codeList"/>
</template>