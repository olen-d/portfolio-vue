<script setup>
  import { onMounted, ref, watch } from 'vue'

  const emits = defineEmits(['changeFormValues'])

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
      default: 'Icon'
    },
    placeholder: {
      type: String,
      default: 'Enter the icon name...'
    },
    required: {
      type: Boolean,
      default: false
    }
  })

  const changedState = { isChanged: false }
  const errorMessage = 'Please enter a valid icon name'
  const isValid = ref(false)
  const icon = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    icon.value = props.initialValue
    emitChange()
  })

  const emitChange = () => {
    emits('changeFormValues', { inputName: 'icon', inputValue: icon.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
  }

  const handleBlur = () => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = validate(icon.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const validate = icon => {
    const isValid = typeof icon === 'string' && icon.length > 0
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
    <div class="input-icon">
      <label for="inputIcon" v-bind:class="validationStatus">
        {{ labeltext }}
      </label>
      <input
        v-model="icon"
        type="text"
        class="u-full-width"
        id="inputIcon"
        :placeholder="placeholder"
        :required="required"
        @blur="handleBlur"
      />
    </div>
  </template>
