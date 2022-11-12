<script setup>
  import { onMounted, onUnmounted, ref, watch } from 'vue'

  import { useRoute } from 'vue-router'

  const props = defineProps({
    links: {
      type: Array
    },
    showHamburger: {
      type: Boolean
    }
  })

  const theNavHamburger = ref(null)
  const visible = ref(false)

  const route= useRoute()

  onMounted(() => {
    window.addEventListener('click', handleClick)
    window.addEventListener('touchstart', handleTouchStart)
  })

  onUnmounted(() => {
    window.removeEventListener('click', handleClick)
    window.removeEventListener('touchstart', handleTouchStart)
  })

  const handleClick = event => {
    if(!theNavHamburger.value.contains(event.target)){
        visible.value = false
      }
  }

  const handleTouchStart = event => {
    if(!theNavHamburger.value.contains(event.targetTouches[0].target)){
        visible.value = false
      }
  }

  const toggleDropdownMenu = () => {
    visible.value = !visible.value
  }

  watch(() => route.name, () => { visible.value = false })
</script>

<template>
  <nav class="the-nav-hamburger" ref="theNavHamburger">
    <span @:click="toggleDropdownMenu" class="hamburger"><i class="fas fa-bars"></i></span>
    <div class="dropdown-container">
      <ul v-if="visible && showHamburger">
        <li v-for="link in links" :key="link.id"><router-link :to="link.uri">{{ link.title }}</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
  .hamburger {
    margin:1.5rem 6rem 1rem 6rem;
  }

  .dropdown-container {
    position:fixed;
    top:6rem;
    left:0px;
    width:100%;
    z-index:8950;
    background-color:#3d3d3d;
    color:#ffffff;
    overflow:hidden;
  }

  .dropdown-container ul {
    list-style:none;
  }

  .dropdown-container li {
    margin-left:6rem;
    margin-top:3rem;
    margin-bottom:3rem;
  }

  .dropdown-container li:last-child {
    margin-bottom:4.5rem;
  }

  .dropdown-container li a:link, 
  .dropdown-container li a:visited {
    text-decoration:none;
    color:#ffffff;
  }

  .dropdown-container li a:hover {
    color:#fcc914;
  }
</style>
