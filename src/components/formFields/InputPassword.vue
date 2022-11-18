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
      default: 'Password'
    },
    placeholder: {
      type: String,
      default: 'Enter your password...'
    },
    required: {
      type: Boolean,
      default: false
    }
  })

  const emits = defineEmits(['changeFormValues'])

  const changedState = { isChanged: false }
  const errorMessage = 'Please enter a valid password. Passwords must be at least eight characters long, with one uppercase and one lowecase letter and at least one number or special character.'
  const isValid = ref(false)
  const password = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    password.value = props.initialValue
    emitChange()
  })

  const emitChange = () => {
    emits('changeFormValues', { inputName: 'password', inputValue: password.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage })
  }

  const handleBlur = async () => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = await validate(password.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  /**
   * Validate that a potential password meets minimum requirements
   * @author Olen Daelhousen <portfolio@olen.dev>
   * @param {string} password - the password to be tested
   * @returns {Promise} Promise object represents true if the password passes validation or false if not
   */

  const validate = password => {
    return new Promise((resolve, reject) => {
      try {
        const oneUpper = /[A-Z]/
        const oneLower = /[a-z]/
        const oneDigit = /\d/
        const oneSpecial = /[!@#$%^&*()-+=]/

        const isOneUpper = oneUpper.test(password)
        const isOneLower = oneLower.test(password)
        const isOneDigit = oneDigit.test(password)
        const isOneSpecial = oneSpecial.test(password)
        const isLength = password && password.length >= 8; // Short circuit to avoid promise rejection if null or undefined password is passed

        if (
          isOneUpper &&
          isOneLower &&
          (isOneDigit || isOneSpecial) &&
          isLength
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch {
        reject(false);
      }
    })
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
  <div class="input-password">
    <label for="inputPassword" :class="validationStatus">
      {{ labeltext }}
    </label>
    <input
      v-model="password"
      type="password"
      class="u-full-width"
      id="inputPassword"
      :placeholder="placeholder"
      :required="required"
      @blur="handleBlur"
    />
  </div>
</template>
