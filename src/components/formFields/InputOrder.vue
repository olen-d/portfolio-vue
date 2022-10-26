<script setup>
  import { onMounted, ref, watch } from 'vue'

  const emits = defineEmits(['changeFormValues'])

  const props = defineProps({
    initialValue: {
      type: Number,
      default: null
    },
    isServerError: {
      type: Boolean,
      default: false
    },
    labeltext: {
      type: String,
      default: 'Order'
    },
    placeholder: {
      type: String,
      default: 'Enter the priority of the item...'
    },
    required: {
      type: Boolean,
      default: false
    }
  })

  const changedState = { isChanged: false }
  const errorMessage = 'Please enter a valid order priority'
  const isValid = ref(false)
  const order = ref(0)
  const validationStatus = ref('')

  onMounted(() => {
    order.value = props.initialValue
    emitChange()
  })

  const emitChange = () => {
    emits('changeFormValues', { inputName: 'order', inputValue: order.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
  }

  const handleBlur = () => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = validate(order.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const validate = order => {
    const isNumber = Number.isFinite(order)
    const isValid = isNumber && order >= 0
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
    <div class="input-order">
      <label for="inputOrder" v-bind:class="validationStatus">
        {{ labeltext }}
      </label>
      <input
        v-model="order"
        type="number"
        class="u-full-width"
        id="inputOrder"
        :placeholder="placeholder"
        :required="required"
        @blur="handleBlur"
      />
    </div>
  </template>
