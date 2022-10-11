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
      default: 'Username'
    },
    placeholder: {
      type: String,
      default: 'Enter your username...'
    },
    required: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['changeFormValues'])

  const errorMessage = 'Please enter a valid username'
  const isValid = ref(false)
  const username = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    username.value = props.initialValue
    emit('changeFormValues', { inputName: 'username', inputValue: username.value, isValid: isValid.value, errorMessage })
  })

  const handleBlur = () => {
    isValid.value = validate(username.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emit('changeFormValues', { inputName: 'username', inputValue: username.value, isValid: isValid.value, errorMessage })
  }

  const validate = username => {
    const alphaNumeric = /^[a-zA-Z\-_]+$/
    const isValid = alphaNumeric.test(username)
    return isValid
  }

  watch(() => props.isServerError, (isServerError, prevIsServerError) => {
    if (isServerError) {
      validationStatus.value = 'error'
      emit('changeFormValues', { inputName: 'username', inputValue: lastName.value, isValid: false, errorMessage })
    }
  })

  </script>

  <template>
    <div class="input-username">
      <label for="inputUsername" v-bind:class="validationStatus">
        {{ labeltext }}
      </label>
      <input
        v-model="username"
        type="email"
        class="u-full-width"
        id="inputUsername"
        :placeholder="placeholder"
        :required="required"
        @blur="handleBlur"
      />
    </div>
  </template>
