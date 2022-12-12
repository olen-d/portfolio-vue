<script setup>
  import { onMounted, ref, watch } from 'vue'

  const emits = defineEmits(['changeFormValues', 'removeFormValues'])

  const props = defineProps({
    errorMessage: {
      type: String,
      default: 'Please select a file to upload'
    },
    inputName: {
      type: String,
      default: 'file'
    },
    labeltext: {
      type: String,
      default: 'File'
    },
    shouldClearInput: {
      type: Boolean,
      default: false
    }
  })

  const changedState = { isChanged: false }
  const inputFile = ref(null)
  const inputValue = ref(null)
  const isValid = ref(false)
  const validationStatus = ref('')

  onMounted(() => {
    emitChange()
  })

  const emitChange = () => {
    emits('changeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
  }

  const onFileChange = event => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    inputValue.value = event.target.files[0]
    // isValid.value = validate(event.target.files[0].length)
    isValid.value = true
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const validate = value => {
    const isValid = value > 0
    return isValid
  }

  watch(() => props.isServerError, (isServerError, prevIsServerError) => {
    if (isServerError) {
      validationStatus.value = 'text-error'
      isValid.value = false
      emitChange()
    }
  })

  watch(() => props.shouldClearInput, (newShouldClearInput, prevShouldClearInput) => {
    if (newShouldClearInput) {
      inputFile.value.value = null
      inputValue.value = null
      changedState.isChanged = false
      isValid.value = false
      emits('removeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
    }
  })
</script>

<template>
  <div class="input-file-single">
    <label for="file" v-bind:class="validationStatus">
      {{ labeltext }}
    </label>
    <input
      name="file"
      ref="inputFile"
      type="file"
      @change="onFileChange"
    />
  </div>
</template>
