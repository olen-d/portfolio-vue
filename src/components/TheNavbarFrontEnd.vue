<script setup>
  import { ref } from 'vue'

  import NavHamburger from '@/components/NavHamburger.vue'

  const props = defineProps({
    showStandard: {
      type: Boolean
    },
    showHamburger: {
      type: Boolean
    }
  })

  // TODO: Change uri to named path
  // TODO: Set up the DB to include this information
  const links = ref(
    [
      { id: 0, sort: 0, title: 'Home', uri: '/home' },
      { id: 1, sort: 1, title: 'About', uri: '/about' },
      { id: 2, sort: 2, title: 'Projects', uri: '/projects' },
      { id: 3, sort: 3, title: 'Contact', uri: '/contact' }
    ]
  )
</script>

<template>
  <div class="the-navbar-front-end-container">
    <nav class="the-navbar-front-end" v-if="showStandard">
      <ul>
        <li v-for="link in links" :key="link.id">
          <router-link :to="link.uri">{{ link.title }}</router-link>
        </li>
      </ul>
    </nav>
    <NavHamburger
      v-if="showHamburger"
      :links="links"
      :showHamburger="showHamburger"
    />
  </div>
</template>

<style scoped>
  .the-navbar-front-end-container {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0rem;
    left: 0rem;
    width: 100%;
    z-index: 9000;
    background-color: #3d3d3d;
    color: #ffffff;
    height: 6rem;
  }

  .the-navbar-front-end {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .the-navbar-front-end ul {
    display: flex;
    align-items: center;
    list-style: none;
    margin-bottom: 0rem;
  }

  .the-navbar-front-end li {
    margin-bottom: 0rem;
    color: #ffffff;
  }

  .the-navbar-front-end li:first-child {
    margin-left: 6rem;
  }

  .the-navbar-front-end li:not(first-child) {
    margin-left: 4rem;
  }

  .the-navbar-front-end li a:link,
  .the-navbar-front-end li a:visited {
    color: #ffffff;
    text-decoration: none;
  }

  .the-navbar-front-end li a:hover {
    color: #fcc914;
    text-decoration: none;
  }
</style>
