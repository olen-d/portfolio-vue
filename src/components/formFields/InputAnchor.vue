<script setup>
  import { onMounted, ref, watch } from 'vue'

  const emits = defineEmits(['changeFormValues', 'removeFormValues'])

  const props = defineProps({
    editValue: {
      type: String,
      default: ''
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
      default: 'Anchor'
    },
    placeholder: {
      type: String,
      default: 'Enter text for the link...'
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
  const errorMessage = 'Please enter a valid anchor'
  const isValid = ref(false)
  const anchor = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    anchor.value = props.initialValue
    emitChange('anchor', anchor.value)
  })

  const emitChange = (name, value) => {
    const isValidValue = name === 'anchor' ? isValid.value : true
    const errorMessageValue = name === 'anchor' ? errorMessage : null
    emits('changeFormValues', { inputName: name, inputValue: value, isChanged: changedState.isChanged, isValid: isValidValue, errorMessage: errorMessageValue })
  }

  const handleBlur = () => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = validate(anchor.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange('anchor', anchor.value)
  }

  const validate = anchor => {
    const alphaNumericPunctuation = /^[a-zA-Z0-9-]+[!?.]*(,? [a-zA-Z0-9-]+[!?.]*)*$/
    const isValid = alphaNumericPunctuation.test(anchor)
    return isValid
  }

  watch(() => props.editValue, (newEditValue, prevEditValue) => {
    anchor.value = newEditValue
    changedState.isChanged = false
    isValid.value = false
    emitChange('anchor', anchor.value)
  })

  watch(() => props.isServerError, (isServerError, prevIsServerError) => {
    if (isServerError) {
      validationStatus.value = 'text-error'
      isValid.value = false
      emitChange('anchor', anchor.value)
    }
  })

  watch(() => props.shouldClearInput, (newShouldClearInput, prevShouldClearInput) => {
    if (newShouldClearInput) {
      anchor.value = ''
      changedState.isChanged = false
      isValid.value = false
      emits('removeFormValues', { inputName: 'anchor' })
    }
  })
  </script>

  <template>
    <div class="input-anchor">
      <label for="inputAnchor" v-bind:class="validationStatus">
        {{ labeltext }}
      </label>
      <input
        v-model="anchor"
        type="text"
        class="u-full-width"
        id="inputAnchor"
        :placeholder="placeholder"
        :required="required"
        @blur="handleBlur"
      />
    </div>
  </template>
