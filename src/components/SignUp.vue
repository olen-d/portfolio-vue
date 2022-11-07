<script setup>
  import SignUpForm from '@/components/SignUpForm.vue'

  import { onMounted } from 'vue'
  import { useAuthStore } from '@/store/auth.js'

  const authStore = useAuthStore()

  onMounted(() => {
    authStore.signupPage = true
  })
</script>

<template>
  <div class="sign-up">
    <div class="row">
      <div class="three columns">
        &nbsp;
      </div>
      <div class="six columns">
        <SignUpForm />
      </div>
      <div class="three columns">
        &nbsp;
      </div>
    </div>
  </div>
</template>
