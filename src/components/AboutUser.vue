<script setup>
  import HeaderFrontEnd from '@/components/HeaderFrontEnd.vue'
  import UserFullName from '@/components/UserFullName.vue'
  import UserProfile from '@/components/UserProfile.vue'
</script>

<template>
  <div class="about-user">
    <HeaderFrontEnd />
    <div class="container">
      <div class="row">
        <div class="twelve columns">
          <div class="hexa">
            <div class="hex1">
              <div class="hex2">
                <img
                  src="./../assets/images/headshot_01.jpg"
                  alt="Olen Daelhousen's Headshot"
                  width="100%"
                  height="auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="one column">
          &nbsp;
        </div>
        <div class="ten columns">
          <UserFullName username="olen.d" />
          <UserProfile username="olen.d" />
        </div>
        <div class="one column">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .about {
    padding-bottom: 8rem;
  }

  .about-user {
    padding: 0px;
    margin: 0px;
    width: 100%;
  }
</style>
