<script setup>
  import FormResetPassword from '@/components/FormResetPassword.vue'

  const props = defineProps({
    token: {
      required: true,
      type: String
    }
  })
</script>

<template>
  <div class="reset-password-page">
    <FormResetPassword :token="token" />
  </div>
</template>
