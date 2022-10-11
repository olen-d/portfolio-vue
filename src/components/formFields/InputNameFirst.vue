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

  const emit = defineEmits(['changeFormValues'])

  const errorMessage = 'Please enter a valid first name'
  const isError = ref(false)
  const isValid = ref(false)
  const firstName = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    firstName.value = props.initialValue
    emit('changeFormValues', { inputName: 'firstName', inputValue: firstName.value, isValid: isValid.value, errorMessage })
  })

  const handleBlur = () => {
    isValid.value = validate(firstName.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emit('changeFormValues', { inputName: 'firstName', inputValue: firstName.value, isValid: isValid.value, errorMessage })
  }

  const validate = firstName => {
    const alphaNumeric = /^[a-zA-Z\-_]+$/
    const isValid = alphaNumeric.test(firstName)
    return isValid
  }

  watch(() => props.isServerError, (isServerError, prevIsServerError) => {
    if (isServerError) {
      validationStatus.value = 'text-error'
      emit('changeFormValues', { inputName: 'firstName', inputValue: firstName.value, isValid: false, errorMessage })
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
        type="email"
        class="u-full-width"
        id="inputNameFirst"
        :placeholder="placeholder"
        :required="required"
        @blur="handleBlur"
      />
    </div>
  </template>
