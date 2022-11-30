<script setup>
  import { computed, ref } from 'vue'

  import AlertMessage from '@/components/AlertMessage.vue'
  import InputEmail from '@/components/formFields/InputEmail.vue'
  import InputNameFull from '@/components/formFields/InputNameFull.vue'
  import TextareaGeneric from '@/components/formFields/TextareaGeneric.vue'

  const props = defineProps({
    formName: {
      type: String,
      default: 'Contact Us'
    },
    submitButtonAction: {
      type: String,
      default: 'Send a Message'
    }
  })

  const errorDescription = ref('')
  const errorTitle = ref('')
  const formValues = ref([])
  const infoDescription = ref ('')
  const isError = ref(false)
  const isInfo = ref(false)
  const isSuccess = ref(false)
  const shouldClearInputs = ref(false)
  const successDescription = ref('')
  const successTitle = ref('')

  const getFormErrorsChanged = () => {
    const formErrorsChanged = formValues.value.filter(element => {
      return element.isChanged !== false && element.isValid === false
    })
    return formErrorsChanged
  }

  const handleSubmit = async () => {
    const formErrors = getFormErrorsChanged()

    if (formErrors.length > 0) {
      updateFormErrors(formErrors)
      return
    } else {
      const data = {}

      formValues.value.forEach(element => {
        const { inputName, inputValue } = element
        data[inputName] = inputValue
      })

      const { email: fromAddress, fullName, genericText: message } = data
      const html = `${message} <p>Contact Name: ${fullName}<br />Contact Email: ${fromAddress}</p>` // ! TODO: Remember to detect html and add <html>, <body>, and convert linebreaks to <p>, <br />
      const subjectPrefix = '[OLEN.DEV]'
      const subject = `Website Contact Form Message From ${fullName}`
      const subjectProcessed = subject.includes(subjectPrefix) ? subject : `${subjectPrefix} ${subject}`
      const messageStripped = message.replace(/(<([^>]+)>)/gi, '') // ! TODO: Update this with a more robust function and convert <p> & <br> to \n
      const text = `${messageStripped} \n\n Contact Name: ${fullName}\nContact Email: ${fromAddress}`
      const toAddress = 'contact@olen.dev'

      const mailOptions = {
        from: fromAddress,
        to: toAddress,
        subject: subjectProcessed,
        text,
        html
      }
      sendMail(mailOptions)
    }
  }

  const removeFormValues = event => {
    const { inputName: name } = event
    const valuesIndex = formValues.value.findIndex(element => element.inputName === name)
    formValues.value.splice(valuesIndex, 1) // Mutates formValues
    if (formValues.value.length === 0) { shouldClearInputs.value = false }
  }

  const sendMail = async mailOptions => {
    infoDescription.value = 'Sending your message...'
    isInfo.value = true

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/mail/send`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ mailOptions })
        }
      );

      const json = response.ok ? await response.json() : null

      if (!json.error) {
        isInfo.value = false
        shouldClearInputs.value = true
        successDescription.value = `Thank you for getting in touch, your message was successfully sent to ${json.accepted}. You can expect a response within 24 hours. `
        isSuccess.value = true
      } else {
        isInfo.value = false
        errorDescription.value = 'Something has gone terribly wrong and your message was not sent. Please try again.'
        errorTitle.value = 'Server Error'
        isError.value = true
        // TODO, parse json.error and provide a more useful error message
      }
    } catch (error) {
      return {
        type: 'error',
        message: 'Internal server error.',
        error
      }
    }
  }

  const updateFormValues = event => {
    const { inputName: name } = event
    const valuesIndex = formValues.value.findIndex(element => element.inputName === name)
    if (valuesIndex === -1) {
      formValues.value.push(event)
    } else {
      formValues.value[valuesIndex] = event
    }
    const formErrors = getFormErrorsChanged()
    updateFormErrors(formErrors)
  }

  const updateFormErrors = formErrors => {
    if (formErrors.length > 0) {
      const errorMessages = formErrors.map(element => {
        return element.errorMessage
      })
      errorDescription.value = errorMessages.join('. ') + '.'

      const numberAgreement = formErrors.length === 1 ? 'An Error' : 'Errors'
      errorTitle.value = `The ${props.formName} Form Has ${numberAgreement}`

      isError.value = true
    } else {
      isError.value = false
      errorDescription.value = ''
      errorTitle.value = ''
    }
  }

  const isDisabled = computed(() => {
    const formErrors = getFormErrorsChanged()
    return formErrors.length > 0
  })
</script>

<template>
  <div class="row">
    <div class="one column">
      &nbsp;
    </div>
    <div class="ten columns">
      <h5>
        {{ formName }}
      </h5>
      <div class="form-contact-success" v-if="isSuccess">
        <AlertMessage :title="successTitle" type="success">
          {{ successDescription }}
        </AlertMessage>
      </div>
      <div class="form-contact-error" v-if="isError">
        <AlertMessage :title="errorTitle" type="error">
          {{ errorDescription }}
        </AlertMessage>
      </div>
    </div>
    <div class="one column">
      &nbsp;
    </div>
  </div>
  <form>
    <div class="row">
      <div class="one column">
        &nbsp;
      </div>
      <div class="five columns">
        <InputNameFull
          :shouldClearInput="shouldClearInputs"
          @change-form-values="updateFormValues($event)"
          @remove-form-values="removeFormValues($event)"
        />
      </div>
      <div class="five columns">
        <InputEmail
          :shouldClearInput="shouldClearInputs"
          @change-form-values="updateFormValues($event)"
          @remove-form-values="removeFormValues($event)"
      />
      </div>
      <div class="one column">
        &nbsp;
      </div>
    </div>
    <div class="row">
      <div class="one column">
        &nbsp;
      </div>
      <div class="ten columns">
        <TextareaGeneric 
          errorMessage="Please enter a valid message"
          labeltext="Message"
          placeholder="Let me know what you need..."
          :shouldClearInput="shouldClearInputs"
          @change-form-values="updateFormValues($event)"
          @remove-form-values="removeFormValues($event)"
        />
        <div class="form-contact-info" v-if="isInfo">
          <AlertMessage type="info">
            {{ infoDescription }}
          </AlertMessage>
        </div>
      </div>
      <div class="one column">
        &nbsp;
      </div>
    </div>
    <div class="row">
      <div class="one column">
        &nbsp;
      </div>
      <div class="ten columns">
        <button
          :disabled = "isDisabled"
          @click.prevent="handleSubmit"
          class="button-primary"
        >
          {{ submitButtonAction }}
        </button>
      </div>
      <div class="one column">
        &nbsp;
      </div>
    </div>
  </form>
</template>