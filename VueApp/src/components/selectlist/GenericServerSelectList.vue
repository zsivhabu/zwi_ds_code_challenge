<script lang="ts">

import {defineComponent, ref} from "vue";
import {SelectOption} from "@/models/ui/selectOption";
import {useSelectLists} from "@/stores/selectLists";
import {SelectListUtils} from "@/utils/selectListUtils";

export default defineComponent({
  props: {
    modalValue: {
      type: Object as () => SelectOption,
      required: true,
      default: null,
    },
    onChange: {
      type: Function,
      required: false,
    },
    storeMethodName: {
      type: String,
      required: true,
    },
    selectListFromStore: {
      type: Object as () => SelectOption[],
      default: () => [],
    },
    selectListFromServer: {
      type: Promise<SelectOption[]>,
      required: true,
    }
  },
  setup: function (props, { emit }) {

    const selectOptions = ref<SelectOption[]>([SelectListUtils.DEFAULT_SELECT_LIST_OPTION]);
    selectOptions.value = props.selectListFromStore;

    props.selectListFromServer.then(response => {
      selectOptions.value = response;

      const useSelectList = useSelectLists();
      (useSelectList as any)[props.storeMethodName] = response;

      doOnDoneFetching();
    }).catch(error => {
      console.log(error)
    })

    function handleInput (selectedOption: SelectOption)
    {
      emit("update:modelValue", selectedOption)
      if (props.onChange !== null && props.onChange !== undefined) {
        props.onChange()
      }
    }

    function doOnDoneFetching()
    {
      try {
        //@ts-ignore
        if (!selectOptions.value.find(x => x.id == props.modalValue.id && x.description == props.modalValue.description))
        {
          emit("update:modelValue", SelectListUtils.DEFAULT_SELECT_LIST_OPTION)
        }
        else 
        {
          emit("update:modelValue", props.modalValue)
        }
      } catch (e) {
        emit("update:modelValue", SelectListUtils.DEFAULT_SELECT_LIST_OPTION)
      }
    }

    return {
      selectOptions,
      modelValue: props.modalValue,
      handleInput
    };
  },
});
</script>
<template>
  <v-select v-model="modelValue" :options="selectOptions" :clearable="false"   class=" mb-2" @option:selected="handleInput"></v-select>
</template>