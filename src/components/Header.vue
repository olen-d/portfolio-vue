<template>
  <div class="logo-header" v-if="viteHostURL">
    <img :src="returnImageSource('/assets/images/OD_min_500x500.png')" width="200" height="200" />
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      viteHostURL: null
    }
  },

  methods: {
    returnImageSource(image) {
      return `${import.meta.env.VITE_ASSETS_HOST}${image}`
    }
  },

  created () {
    console.log(`HOST: ${import.meta.env.VITE_ASSETS_HOST}`)
    this.viteHostURL = import.meta.env.VITE_ASSETS_HOST
  }
}
</script>

<style scoped>

</style>
