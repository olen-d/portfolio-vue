<script setup>
  import { onMounted } from 'vue'
  import { onBeforeRouteLeave, useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/auth.js'

  import SignUpForm from '@/components/SignUpForm.vue'

  const router = useRouter()
  const authStore = useAuthStore()

  onMounted(() => {
    authStore.signupPage = true
  })

  onBeforeRouteLeave((to, from) => {
    authStore.signupPage = false
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
