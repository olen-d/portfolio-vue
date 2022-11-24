<script setup>
  import { onMounted, ref, watch } from 'vue'

  const props = defineProps({
    initialErrorMessage: {
      type: String,
      default: 'Please enter valid text'
    },
    initialValue: {
      type: String,
      default: ''
    },
    isServerError: {
      type: Boolean,
      default: false
    },
    labeltext: {
      type: String,
      default: 'Text'
    },
    placeholder: {
      type: String,
      default: 'Enter some text...'
    },
    required: {
      type: Boolean,
      default: false
    },
    shouldClearInput: {
      type: Boolean,
      default: false
    }
  })

  const emits = defineEmits(['changeFormValues', 'removeFormValues'])

  const changedState = { isChanged: false }
  const errorMessage = ref('')
  const isValid = ref(false)
  const genericText = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    errorMessage.value = props.initialErrorMessage
    genericText.value = props.initialValue
    emitChange()
  })

  const emitChange = () => {
    emits('changeFormValues', { inputName: 'genericText', inputValue: genericText.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
  }

  const handleBlur = () => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = validate(genericText.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const validate = genericText => {
    const isValid = genericText && genericText.length > 0 ? true : false
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
      genericText.value = ''
      changedState.isChanged = false
      isValid.value = false
      emits('removeFormValues', { inputName: 'genericText' })
    }
  })
</script>

<template>
  <div class="text-area-generic">
    <label for="textAreaGeneric" :class="validationStatus">
      {{ labeltext }}
    </label>
    <textarea
      v-model="genericText"
      class="u-full-width"
      id="textAreaGeneric"
      :placeholder="placeholder"
      :required="required"
      @blur="handleBlur"
    >
    </textarea>
  </div>
</template>
