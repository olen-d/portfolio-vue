<template>
  <div id="app">
    <navbar />
      <div class="logo-header">
        <img src="/assets/images/OD_min_500x500.png" width="300px" height="300px" />
      </div>
    <router-view />
    <div class="footer">
	    <social />	
			<p>
				Copyright &copy; 2019 Olen Daelhousen
			</p>
		</div>
  </div>
</template>

<script>

import Navbar from "./components/Navbar.vue";
import Social from "./components/Social.vue";

export default {
  name: 'app',

  components: {
    Navbar,
    Social
  }
}

</script>

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
</style>
