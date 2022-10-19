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
      default: 'Email Address'
    },
    placeholder: {
      type: String,
      default: 'Enter your email address...'
    },
    required: {
      type: Boolean,
      default: false
    }
  })

  const emits = defineEmits(['changeFormValues'])

  const changedState = { isChanged: false }
  const errorMessage = 'Please enter a valid email address'
  const isValid = ref(false)
  const emailAddress = ref('')
  const validationStatus = ref('')

  onMounted(() => {
   emailAddress.value = props.initialValue
   emitChange()
  })

  const checkMx = async emailAddress => {
    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/mail/check-mx/${emailAddress}`
      );
      const data = await result.json();
      const { mxExists } = data;

      return mxExists ? true : false;
    } catch {
      return false;
    }
  }

  const emitChange = () => {
    emits('changeFormValues', { inputName: 'email', inputValue: emailAddress.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
  }

  const handleBlur = async () => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = await validate(emailAddress.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const validate = async emailAddress => {
    const expression = /.+@.+\..+/i
    const isValidFormat = expression.test(String(emailAddress).toLowerCase())

    if (isValidFormat) {
      return await checkMx(emailAddress)
    } else {
      return false
    }
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
  <div class="input-email">
    <label for="email" v-bind:class="validationStatus">
      {{ labeltext }}
    </label>
    <input
      v-model="emailAddress"
      type="email"
      class="u-full-width"
      id="email"
      :placeholder="placeholder"
      :required="required"
      @blur="handleBlur"
    />
  </div>
</template>
