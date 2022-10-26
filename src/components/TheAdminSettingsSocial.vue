<script setup>
  import AdminSocialAdd from '@/components/AdminSocialAdd.vue'
  import TheListSocial from '@/components/TheListSocial.vue'

  import { ref } from 'vue'

  const createdLinkResult = ref({})

  const socialMediaLinkCreated = event => {
    createdLinkResult.value = event
  }
</script>

<template>
  <div class="the-admin-settings-social">
    <h3>
      Social
    </h3>
    <TheListSocial :newLinkData="createdLinkResult" />
    <AdminSocialAdd @social-media-link-created="socialMediaLinkCreated" />
  </div>
</template>
