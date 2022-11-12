<script setup>
  import { ref } from 'vue'

  const props = defineProps({
    navItem: {
      type: Object
    }
  })

  const visible = ref(false)

  const toggleIsVisible = () => {
    visible.value = !visible.value
  }

</script>

<template>
  <div class="nav-item" v-if="navItem.children" @click="toggleIsVisible">
    <router-link :to="navItem.uri">
      {{ navItem.title }}
    </router-link>
    <i class="fas fa-angle-down angle-down"></i>
    <ul v-if="navItem.children && visible">
      <li
        v-for="navSubItem in navItem.children"
        :key="`${navItem.title}-${navSubItem.id}`"
      >
        <router-link :to="navSubItem.uri">
          {{ navSubItem.title }}
        </router-link>
      </li>
    </ul>
  </div>
  <div class="nav-item" v-else>
    <router-link :to="navItem.uri">{{ navItem.title }}</router-link>
  </div>
</template>

<style scoped>
  .angle-down {
    margin-left: 1rem;
  }

  .nav-item {
    padding-right: 2rem;
    padding-left: 2rem;
    display: inline;
    color: #ffffff;
  }

  .nav-item a:link,
  .nav-item a:visited {
    text-decoration: none;
    color: #ffffff;
  }

  .nav-item a:hover {
    color: #ffffff;
  }

  ul li ul {
    position: absolute;
    margin-left: 0rem;
    min-width: 20rem;
    top: 4.9rem;
    left: 0rem;
    display: block;
    list-style: none;
    font-size: 100%;
  }

  ul li ul :hover {
    background-color: #36a0ce;
  }

  ul li ul li {
    width: 100%;
    margin-bottom: 0rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 2rem;
    background-color: #136a9b;
  }
</style>
