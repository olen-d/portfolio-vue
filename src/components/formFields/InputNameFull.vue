<script setup>
  import { onMounted, ref, watch } from 'vue'

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
      default: 'Name'
    },
    placeholder: {
      type: String,
      default: 'Enter your full name...'
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
  const errorMessage = 'Please enter a valid full name'
  const isValid = ref(false)
  const fullName = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    fullName.value = props.initialValue
    emitChange()
  })

  const emitChange = () => {
    emits('changeFormValues', { inputName: 'fullName', inputValue: fullName.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
  }

  const handleBlur = () => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = validate(fullName.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const validate = fullName => {
    const alphaNumeric = /^[a-zA-Z\-]+( ?[a-zA-Z\-])+$/
    const isValid = alphaNumeric.test(fullName)
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
      fullName.value = ''
      changedState.isChanged = false
      isValid.value = false
      emits('removeFormValues', { inputName: 'fullName' })
    }
  })
  </script>

  <template>
    <div class="input-name-full">
      <label for="inputNameFull" :class="validationStatus">
        {{ labeltext }}
      </label>
      <input
        v-model="fullName"
        type="text"
        class="u-full-width"
        id="inputNameFull"
        :placeholder="placeholder"
        :required="required"
        @blur="handleBlur"
      />
    </div>
  </template>
