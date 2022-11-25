<script setup>
  import { computed, onMounted, ref } from 'vue'

  const contact = ref({})
  const loading = ref(false)

  onMounted(async () => {
    loading.value = true

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/profiles/contact/olen.d`
      )
      if (response.ok) {
        const json = await response.json()
        contact.value = json.contact
        loading.value = false
      } else {
        throw new Error('Network response was not ok. Unable to fetch. ')
      }
    } catch (error) {
      loading.value = false
    }
  })

  const toPhoneUS = computed(() => {
    const value = contact.value?.tel
      if (typeof value === 'string') {
        const areaCode = value.substr(0, 3)
        const prefix = value.substr(3, 3)
        const lineNumber = value.substr(6)
        return `(${areaCode}) ${prefix}-${lineNumber}`
      } else {
        return null
      }
  })
</script>

<template>
  <div class="contact-information">
    <p v-if="!loading">
      You've made it this far, so please take the time to reach out and start discussing your project with me. I can be contacted at {{ toPhoneUS }}, or send an email to <a :href="`mailto:${contact?.email}`">{{contact?.email}}</a>.
    </p>
  </div>
</template>
