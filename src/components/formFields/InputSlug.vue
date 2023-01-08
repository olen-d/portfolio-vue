<script setup>
  import { onMounted, ref, watch } from 'vue'

  const props = defineProps({
    errorMessage: {
      type: String,
      default: 'Please enter a valid slug'
    },
    initialValue: {
      type: String,
      default: null
    },
    inputName: {
      type: String,
      default: 'slug'
    },
    isServerError: {
      type: Boolean,
      default: false
    },
    labeltext: {
      type: String,
      default: 'Slug'
    },
    placeholder: {
      type: String,
      default: 'Enter a slug...'
    },
    required: {
      type: Boolean,
      default: false
    },
    shouldClearInput: {
      type: Boolean,
      default: false
    },
    valueToSlug: {
      type: String,
      default: null
    }
  })

  const emits = defineEmits(['changeFormValues', 'removeFormValues'])

  const changedState = { isChanged: false }
  const isValid = ref(false)
  const inputValue = ref('')
  const validationStatus = ref('')

  onMounted(() => {
    inputValue.value = props.initialValue
    emitChange()
  })

  const emitChange = () => {
    emits('changeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
  }

  const createSlug = value => {
    const stopWords = [
      'a',
      'after',
      'along',
      'an',
      'and',
      'around',
      'at',
      'but',
      'by',
      'for',
      'from',
      'nor',
      'of',
      'on',
      'or',
      'so',
      'the',
      'to',
      'with',
      'without',
      'yet'
    ]
    const stopWordsBoundaries = stopWords.map(element => {
      return `\\b${element}\\b` // Need to escape \ because a constructor function is used later
    })
    const specialCharactersRemoved = value.replace(/[^a-zA-Z0-9 ]/g, '')
    const stopWordsRegEx = new RegExp(stopWordsBoundaries.join('|'), 'gi')
    const stopWordsRemoved = specialCharactersRemoved.replace(stopWordsRegEx, '')
    const stopWordsRemovedTrimmed = stopWordsRemoved.trim()
    const extraSpacesRemoved = stopWordsRemovedTrimmed.replace(/ +/g, ' ')
    const spacesToHyphens = extraSpacesRemoved.replace(/ /g, '-')
    const slug = spacesToHyphens.toLowerCase()
    return slug
  }

  const handleBlur = () => {
    if (!changedState.isChanged) {
      changedState.isChanged = true
    }
    isValid.value = validate(inputValue.value)
    validationStatus.value = isValid.value ? null : 'text-error'
    emitChange()
  }

  const validate = value => {
    const alphaNumeric = /^[a-z0-9-]+$/
    const isValid = alphaNumeric.test(value)
    return isValid
  }

  watch(() => props.initialValue, (newInitialValue, prevInitialValue) => {
    inputValue.value = newInitialValue
    changedState.isChanged = false
    isValid.value = false
    emitChange()
  })

  watch(() => props.isServerError, (isServerError, prevIsServerError) => {
    if (isServerError) {
      validationStatus.value = 'text-error'
      isValid.value = false
      emitChange()
    }
  })

  watch(() => props.shouldClearInput, (newShouldClearInput, prevShouldClearInput) => {
    if (newShouldClearInput) {
      inputValue.value = null
      changedState.isChanged = false
      isValid.value = false
      emits('removeFormValues', { inputName: props.inputName, inputValue: inputValue.value, isChanged: changedState.isChanged, isValid: isValid.value, errorMessage: props.errorMessage })
    }
  })

  watch(() => props.valueToSlug, (newValueToSlug, prevValueToSlug) => {
    if (newValueToSlug) {
      const newSlug = createSlug(newValueToSlug)
      inputValue.value = newSlug
      changedState.isChanged = true
      isValid.value = validate(newSlug)
      emitChange()
    }
  })
</script>

<template>
  <div class="input-slug">
    <label for="inputSlug" :class="validationStatus">
      {{ labeltext }}
    </label>
    <input
      v-model="inputValue"
      type="text"
      class="u-full-width"
      id="inputSlug"
      :placeholder="placeholder"
      :required="required"
      @blur="handleBlur"
    />
  </div>
</template>
