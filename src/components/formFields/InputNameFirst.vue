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
      default: 'First Name'
    },
    placeholder: {
      type: String,
      default: 'Enter your first name...'
    },
    required: {
      type: Boolean,
      default: false
    }
  })

  const emits = defineEmits(['changeFormValues'])

  const changedState = { isChanged: false }
  const errorMessage = 'Please enter a valid first name'
  const isValid = ref(false)
  const firstName = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    firstName.value = props.initialValue
    emitChange()
  })

  const emitChange = () => {
    emits('changeFormValues', { inputName: 'firstName', inputValue: firstName.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
  }

  const handleBlur = () => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = validate(firstName.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const validate = firstName => {
    const alphaNumeric = /^[a-zA-Z\-_]+$/
    const isValid = alphaNumeric.test(firstName)
    return isValid
  }

  watch(() => props.isServerError, (isServerError, prevIsServerError) => {
    if (isServerError) {
      validationStatus.value = 'text-error'
      isValid.value = false
      emitChange()
    }
  })
  </script>

  <template>
    <div class="input-name-first">
      <label for="inputNameFirst" v-bind:class="validationStatus">
        {{ labeltext }}
      </label>
      <input
        v-model="firstName"
        type="text"
        class="u-full-width"
        id="inputNameFirst"
        :placeholder="placeholder"
        :required="required"
        @blur="handleBlur"
      />
    </div>
  </template>
