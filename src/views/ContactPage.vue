<script setup>
  import ContactInformation from '@/components/ContactInformation.vue'
  import FormContact from '@/components/FormContact.vue'
  import HeaderFrontEnd from '@/components/HeaderFrontEnd.vue'
</script>

<template>
  <div class="contact-page">
    <div class="front-end">
      <HeaderFrontEnd />
      <div class="container">
        <div class="row">
          <div class="one column">
            &nbsp;
          </div>
          <div class="ten columns">
            <h1>
              Get in Touch
            </h1>
            <ContactInformation />
          </div>
          <div class="one column">
            &nbsp;
          </div>
        </div>
        <FormContact formName="Send Us a Message" />
      </div>
    </div>
  </div>
</template>
