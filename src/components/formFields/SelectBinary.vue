<script setup>
  import { onMounted, ref, watch } from 'vue'

  const emits = defineEmits(['changeFormValues', 'removeFormValues'])
  const props = defineProps({
    disabledValue: {
      type: String,
      default: 'Select one...'
    },
    errorMessage: {
      type: String,
      default: 'Please choose an option'
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
      default: [
        { _id: 'Yes', option: 'Yes' },
        { _id: 'No', option: 'No' }
      ]
    },
    required: {
      type: Boolean,
      default: false
    },
    inputName: {
      type: String,
      default: 'selectBinary'
    },
    labeltext: {
      type: String,
      default: 'Display Item?'
    },
    shouldClearInput: {
      type: Boolean,
      default: false
    }
  })

  const changedState = { isChanged: false }
  const isValid = ref(false)
  const inputValue = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    inputValue.value = props.initialValue
    emitChange()
  })

  const emitChange = () => {
    emits('changeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
  }

  const handleBlur = event => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = validate(inputValue.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const handleChange = event => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = validate(inputValue.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const validate = value => {
    const isValid = value != ''
    return isValid
  }

  watch(() => props.initialValue, (newInitialValue, prevInitialValue) => {
    inputValue.value = newInitialValue
    changedState.isChanged = false
    isValid.value = false
    emitChange(props.inputName, inputValue.value)
  })

  watch(() => props.shouldClearInput, (newShouldClearInput, prevShouldClearInput) => {
    if (newShouldClearInput) {
      inputValue.value = ''
      changedState.isChanged = false
      isValid.value = false
      emits('removeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
    }
  })
</script>

<template>
  <div class="select-binary">
    <label for="selectBinary" :class="validationStatus">
      {{ labeltext }}
    </label>
    <select v-model="inputValue" @blur="handleBlur" @change="handleChange" name="selectBinary">
      <option disabled value="">{{ disabledValue }}</option>
      <option v-for="{ _id, option } in options" :key="_id" :value="_id">
        {{ option }}
      </option>
    </select>
  </div>
</template>
