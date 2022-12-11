<script setup>
  import { onMounted, ref, watch } from 'vue'

  const props = defineProps({
    errorMessage: {
      type: String,
      default: 'Please enter valid text'
    },
    initialValue: {
      type: String,
      default: null
    },
    inputName: {
      type: String,
      default: 'genericText'
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

  const handleBlur = () => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = validate(inputValue.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const validate = value => {
    const isValid = value && value.length > 0 ? true : false
    return isValid
  }

  watch(() => props.initialValue, (newInitialValue, prevInitialValue) => {
    inputValue.value = newInitialValue
    changedState.isChanged = false
    isValid.value = false
    emitChange(props.inputName, inputValue.value)
  })

  watch(() => props.isServerError, (isServerError, prevIsServerError) => {
    if (isServerError) {
      validationStatus.value = 'text-error'
      isValid.value = false
      emitChange()
    }
  })

  watch(() => props.shouldClearInput, (newShouldClearInput, prevShouldClearInput) => {
    if (newShouldClearInput) {
      inputValue.value = null
      changedState.isChanged = false
      isValid.value = false
      emits('removeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
    }
  })
</script>

<template>
  <div class="text-area-generic">
    <label for="textAreaGeneric" :class="validationStatus">
      {{ labeltext }}
    </label>
    <textarea
      v-model="inputValue"
      class="u-full-width"
      id="textAreaGeneric"
      :placeholder="placeholder"
      :required="required"
      @blur="handleBlur"
    >
    </textarea>
  </div>
</template>
