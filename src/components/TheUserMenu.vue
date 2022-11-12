<script setup>
  import { onMounted, onUnmounted, ref } from 'vue'

  import { useAuthStore } from '@/store/auth.js'

  const authStore = useAuthStore()

  const links = ref([{ id: 0, sort: 0, title: 'My Profile', uri: '/admin/profile' }])
  const visible = ref(false)
  const userMenu = ref(null)

  onMounted(() => {
    window.addEventListener('click', handleClick)
    window.addEventListener('touchstart', handleTouchStart)
  })

  onUnmounted(() => {
    window.removeEventListener('click', handleClick)
    window.removeEventListener('touchstart', handleTouchStart)
  })

  const handleClick = event => {
    if(!userMenu.value.contains(event.target)){
        visible.value = false
      }
  }

  const handleTouchStart = event => {
    if(!userMenu.value.contains(event.targetTouches[0].target)){
        visible.value = false
      }
  }

  const toggleUserMenuDropdown = () => {
    visible.value = !visible.value
  }

  const logout = () => {
    authStore.doLogout = true
  }
</script>

<template>
  <div>
    <div class="user-menu" ref="userMenu">
      <span @click="toggleUserMenuDropdown" class="user-menu-link"><i class="fas fa-user"></i><i class="user-menu-down fas fa-angle-down"></i></span>
    </div>
    <div v-if="visible" class="user-menu-dropdown">
      <ul>
        <li><a @click="logout" class="fake-menu-link">Logout</a></li>
        <li v-for="link in links" :key="link.id"><router-link :to="link.uri">{{ link.title }}</router-link></li>
      </ul>
    </div>
  </div>
</template>

<style>
.user-menu {
  display:flex;
  align-items:center;
  position:fixed;
  top:0px;
  right:0px;
  height:6rem;
  margin-right:4rem;
  z-index:9500;
  color:#ffffff;
}

.user-menu-down {
  margin-left:1rem;
}

.user-menu-dropdown {
  position:fixed;
  top:6rem;
  right:0px;
  z-index:8900;
  padding-right:4rem;
  background-color:#3d3d3d;
}

.user-menu-dropdown ul {
  list-style:none;
}

.user-menu-dropdown li {
  margin-left:3rem;
  margin-top:3rem;
  margin-bottom:3rem;
}

.user-menu-dropdown li:last-child {
  margin-bottom:4.5rem;
}

.user-menu-dropdown li a:link, 
.user-menu-dropdown li a:visited {
  text-decoration:none;
  color:#ffffff;
}

.user-menu-dropdown li a:hover {
  color:#fcc914;
}
</style>
