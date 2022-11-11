<script setup>
  import Navbar from '@/components/Navbar.vue'
  import Social from '@/components/Social.vue'
  import StatusBar from '@/components/StatusBar.vue'

  import { onMounted, watch } from 'vue'

  import { useRouter } from 'vue-router'

  import { useAuthStore } from '@/store/auth.js'
  import { useStatusStore } from '@/store/status.js'

  const authStore = useAuthStore()
  const statusStore = useStatusStore()
  const router = useRouter()

  onMounted(() => {
    authStore.fetchJWT
    authStore.start
  })

  watch(() => authStore.doLogout, (newDoLogout, prevDoLogout) => {
    if (newDoLogout) {
      logout()
    }
  })

  watch(() => authStore.authorized, (newAuthorized, prevAuthorized) => {
    if (!newAuthorized) {
      logout()
    }
  })

  const logout =  () => {
    authStore.$reset()
    localStorage.removeItem('user_token')
    router.push({ name: "home" })
  }
</script>

<template>
  <div id="app">
    <Navbar></Navbar>
    <StatusBar v-if="statusStore.statusCategory && statusStore.statusMessage" />
    <router-view></router-view>
    <div class="footer">
	    <Social />
      <div class="container">	
        <div class="row">
          <div class="four columns">
            &nbsp;
          </div>
          <div class="four columns">
            <p>
              Copyright &copy; 2019 Olen Daelhousen
            </p>
          </div>
          <div class="four columns">
            <p class="right">
              <router-link to="/login" v-if="!authStore.authorized && !authStore.loginPage" class="ntd">Login</router-link>&nbsp;<router-link to="/signup" v-if="!authStore.authorized && !authStore.signupPage" class="ntd">Signup</router-link>
            </p>
          </div>
        </div>
      </div>
		</div>
  </div>
</template>

<style>
  @import "./assets/css/normalize.css";
  @import "./assets/css/skeleton.css";
  @import "./assets/css/style.css";

  /* #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #navigation li a.router-link-exact-active {
    color: #f00;
  } */

  .right {
    text-align: right;
  }

  .ntd {
    text-decoration: none;
  }
</style>
