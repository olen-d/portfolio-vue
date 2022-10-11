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

  const emit = defineEmits(['changeFormValues'])

  const errorMessage = 'Please enter a valid email address'
  const isValid = ref(false)
  const emailAddress = ref('')
  const validationStatus = ref('')

  onMounted(() => {
   emailAddress.value = props.initialValue
    emit('changeFormValues', { inputName: 'emailAddress', inputValue: emailAddress.value, isValid: isValid.value, errorMessage })
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

  const handleBlur = async () => {
    isValid.value = await validate(emailAddress.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emit('changeFormValues', { inputName: 'emailAddress', inputValue: emailAddress.value, isValid: isValid.value, errorMessage })
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
      emit('changeFormValues', { inputName: 'emailAddress', inputValue: emailAddress.value, isValid: false, errorMessage })
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
