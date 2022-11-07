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

  const emits = defineEmits(['changeFormValues'])

  const changedState = { isChanged: false }
  const errorMessage = 'Please enter a valid last name'
  const isValid = ref(false)
  const lastName = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    lastName.value = props.initialValue
    emitChange()
  })

  const emitChange = () => {
    emits('changeFormValues', { inputName: 'lastName', inputValue: lastName.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
  }

  const handleBlur = () => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = validate(lastName.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const validate = lastName => {
    const alphaNumeric = /^[a-zA-Z\-_]+$/
    const isValid = alphaNumeric.test(lastName)
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
    <div class="input-name-last">
      <label for="inputNameLast" v-bind:class="validationStatus">
        {{ labeltext }}
      </label>
      <input
        v-model="lastName"
        type="text"
        class="u-full-width"
        id="inputNameLast"
        :placeholder="placeholder"
        :required="required"
        @blur="handleBlur"
      />
    </div>
  </template>
