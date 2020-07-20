<template>
  <div id="front-end">
    <Header></Header>
    <div class="about">
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
          <UserFullName />
          <Profile />
        </div>
        <div class="one column">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./Header.vue";
import Profile from "./Profile.vue";
import UserFullName from "./UserFullName.vue";

export default {
  components: {
    Header,
    Profile,
    UserFullName
  }
};
</script>

<style scoped>
.about {
  padding-bottom: 8rem;
}
</style>
