<template>
  <div id="social">
    <span v-for="{ _id, text, href, icon } in social" :key="_id" class="social-items">
      <a :href="href" :title="`Olen Daelhousen on ${text}`"><i :class="icon"></i></a>&nbsp;
    </span>
  </div>
</template>

<script>
module.exports = {

  data: () => {
    return {
      social: []
    }
  },

  created() {
    fetch(`${process.env.VUE_APP_API_BASE_URL}/api/social/user/olen.d`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.social = json.social;
      });
  }

}
</script>
