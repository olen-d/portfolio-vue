<script setup>
  import FormSocial from '@/components/FormSocial.vue'
  import TheListSocial from '@/components/TheListSocial.vue'

  import { ref } from 'vue'

  const createdLinkResult = ref({})
  const formAction = ref('add')
  const itemData = ref({})
  const itemId = ref('')
  const submitButtonAction = ref('add')
  const updatedLinkResult = ref({})

  const cancelEdit = event => {
    itemData.value = {}
    formAction.value = 'add'
    submitButtonAction.value = 'add'
  }

  const updateFormAction = event => {
    formAction.value = event
    submitButtonAction.value = event === 'add' ? 'add' : 'save'
  }

  const updateItemData = event => {
    itemData.value = event
  }

  const updateItemId = event => {
    itemId.value = event
  }

  const socialMediaLinkCreated = event => {
    createdLinkResult.value = event
  }

const socialMediaLinkUpdated = event => {
  updatedLinkResult.value = event
}

</script>

<template>
  <div class="the-admin-settings-social">
    <h3>
      Social
    </h3>
    <TheListSocial
      :newLinkData="createdLinkResult"
      :updatedLinkData="updatedLinkResult"
      @update-form-action="updateFormAction($event)"
      @update-item-data="updateItemData($event)"
      @update-item-id="updateItemId($event)"
    />
    <h3>
      <span class="form-action">{{ formAction }}</span> a Social Media Link
    </h3>
    <FormSocial
      :action="formAction"
      :editItemData="itemData"
      :editItemId="itemId"
      :submitButtonAction = "submitButtonAction"
      @cancel-edit="cancelEdit($event)"
      @social-media-link-created="socialMediaLinkCreated($event)"
      @social-media-link-updated="socialMediaLinkUpdated($event)"
      @update-form-action="updateFormAction($event)"
    />
  </div>
</template>

<style scoped>
.form-action {
  text-transform: capitalize;
}
</style>
