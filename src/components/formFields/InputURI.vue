<script setup>
  import { onMounted, ref, watch } from 'vue'

  const emits = defineEmits(['changeFormValues', 'removeFormValues'])

  const props = defineProps({
    errorMessage: {
      type: String,
      default: 'Please enter a valid link URI'
    },
    initialValue: {
      type: String,
      default: null
    },
    inputName: {
      type: String,
      default: 'uri'
    },
    isServerError: {
      type: Boolean,
      default: false
    },
    labeltext: {
      type: String,
      default: 'Link'
    },
    placeholder: {
      type: String,
      default: 'Enter the Link URI...'
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
    const uriRegEx = /^(http|https):\/\/[^ "]+$/ // Extremely simple, should prevent obvious errors
    const isValid = uriRegEx.test(value)
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
    <div class="input-uri">
      <label for="inputURI" :class="validationStatus">
        {{ labeltext }}
      </label>
      <input
        v-model="inputValue"
        type="url"
        class="u-full-width"
        id="inputURI"
        :placeholder="placeholder"
        :required="required"
        @blur="handleBlur"
      />
    </div>
  </template>
