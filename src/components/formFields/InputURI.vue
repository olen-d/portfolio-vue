<script setup>
  import { onMounted, ref, watch } from 'vue'

  const emits = defineEmits(['changeFormValues', 'removeFormValues'])

  const props = defineProps({
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
  const errorMessage = 'Please enter a valid link URI'
  const isValid = ref(false)
  const uri = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    uri.value = props.initialValue
    emitChange()
  })

  const emitChange = () => {
    emits('changeFormValues', { inputName: 'uri', inputValue: uri.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
  }

  const handleBlur = () => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = validate(uri.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const validate = linkUri => {
    const uriRegEx = /^(http|https):\/\/[^ "]+$/ // Extremely simple, should prevent obvious errors
    const isValid = uriRegEx.test(linkUri)
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
      uri.value = ''
      changedState.isChanged = false
      isValid.value = false
      emits('removeFormValues', { inputName: 'uri' })
    }
  })
  </script>

  <template>
    <div class="input-uri">
      <label for="inputURI" v-bind:class="validationStatus">
        {{ labeltext }}
      </label>
      <input
        v-model="uri"
        type="url"
        class="u-full-width"
        id="inputURI"
        :placeholder="placeholder"
        :required="required"
        @blur="handleBlur"
      />
    </div>
  </template>
