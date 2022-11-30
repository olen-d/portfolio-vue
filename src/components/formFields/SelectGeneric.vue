<script setup>
  import { ref } from 'vue'

  const emits = defineEmits(['optionSelected'])
  const props = defineProps({
    disabledValue: {
      type: String,
      default: 'Select one...'
    },
    initialValue: {
      type: String,
      default: ''
    },
    isServerError: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    selectName: {
      type: String,
      default: 'selectGeneric'
    }
  })

  const selectedOption = ref('')

  const onChange = event => {
    emits('optionSelected', { selectName: props.selectName, selectedOption })
  }

</script>

<template>
  <div class="select-generic">
    <select v-model="selectedOption" @change="onChange">
      <option disabled value="">{{ disabledValue }}</option>
      <option v-for="{ _id, option } in options" :key="_id" :value="_id">
        {{ option }}
      </option>
    </select>
  </div>
</template>
