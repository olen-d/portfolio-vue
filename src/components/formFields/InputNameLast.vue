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
      default: 'Last Name'
    },
    placeholder: {
      type: String,
      default: 'Enter your last name...'
    },
    required: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['changeFormValues'])

  const errorMessage = 'Please enter a valid last name'
  const isValid = ref(false)
  const lastName = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    lastName.value = props.initialValue
    emit('changeFormValues', { inputName: 'lastName', inputValue: lastName.value, isValid: isValid.value, errorMessage })
  })

  const handleBlur = () => {
    isValid.value = validate(lasttName.value)
    validationStatus.value = isValid.value ? null : 'error'
    emit('changeFormValues', { inputName: 'lastName', inputValue: lastName.value, isValid: isValid.value, errorMessage })
  }

  const validate = lastName => {
    const alphaNumeric = /^[a-zA-Z\-_]+$/
    const isValid = alphaNumeric.test(lastName)
    return isValid
  }

  watch(() => props.isServerError, (isServerError, prevIsServerError) => {
    if (isServerError) {
      validationStatus.value = 'error'
      emit('changeFormValues', { inputName: 'lastName', inputValue: lastName.value, isValid: false, errorMessage })
    }
  })

  </script>

  <template>
    <div class="input-name-last">
      <label for="inputNameLast" v-bind:class="{ 'text-error': isError }">
        {{ labeltext }}
      </label>
      <input
        v-model="lastName"
        type="email"
        class="u-full-width"
        id="inputNameLast"
        :placeholder="placeholder"
        :required="required"
        @blur="handleBlur"
      />
    </div>
  </template>
