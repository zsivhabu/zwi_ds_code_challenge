<script lang="ts">

import {defineComponent, ref} from "vue";
import {useSelectLists} from "@/stores/selectLists";

export default defineComponent({
  props: {
    modalValue: {
      type: String,
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
      type: Object as () => String[],
    },
    selectListFromServer: {
      type: Promise<String[]>,
      required: true,
    }
  },
  setup: function (props, { emit }) {
    const selectOptions = ref<String[]>(['Any']);
    selectOptions.value = props.selectListFromStore;

    props.selectListFromServer.then(response => {
      selectOptions.value = response;
      const useSelectList = useSelectLists();
      (useSelectList as any)[props.storeMethodName] = response;


      doOnDoneFetching();
    }).catch(error => {
      console.log(error)
    })

    function handleInput (selectedOption: string)
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
          emit("update:modelValue", 'Any')
        }
        else 
        {
          emit("update:modelValue", props.modalValue)
        }
      } catch (e) {
        emit("update:modelValue", 'Any')
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
  <v-select :teleport="true" v-model="modelValue" :options="selectOptions" :clearable="false"   class=" mb-2" @option:selected="handleInput"></v-select>
</template>