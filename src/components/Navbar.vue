<template>
  <nav id="navigation">
    <ul class="nav-link" v-if="showStandard">
      <li v-for="link in links" :key="link.id"><router-link :to="link.uri">{{link.title}}</router-link></li>
    </ul>
    <nav id="adminNavigation" v-if="showStandard && showAdminLinks">
      <ul class="nav-link">
        <li v-for="adminLink in adminLinks" :key="adminLink.id"><router-link :to="adminLink.uri">{{adminLink.title}}</router-link></li>
      </ul>
    </nav>
    <NavHamburger v-if="showHamburger" v-bind:links="links" v-bind:showHamburger="showHamburger" />
  </nav>
</template>

<script>
import NavHamburger from "./NavHamburger";

export default {
  components: {
    NavHamburger
  },

  data: () => { // TODO: Set up the DB to include this information. Remember, only the links are coming from the DB. Window and Visible are coded here.
    return {
      links: [
        {id: 0, sort: 0, title: "Home", uri: "/home"},
        {id: 1, sort: 1, title: "About", uri: "/about"},
        {id: 2, sort: 2, title: "Projects", uri: "/projects"},
        {id: 3, sort: 3, title: "Contact", uri: "/contact"},
      ],

      adminLinks: [
        {id: 4, sort: 4, title: "Admin", uri: "/admin"}
      ],

      window: {
          width: 0,
          height: 0
      }
    }
  },

  computed: {
    showStandard: function() {
      return this.window.width >= 500;
    },
    showHamburger: function() {
      return this.window.width < 500;
    },
    showAdminLinks: function() {
      return this.$store.getters.administrator;
    }
  },

  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },

  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  }
}
</script>

<style scoped>
#navigation {
  display:flex;
  justify-content:space-between;
  align-items:center;
  position:fixed;
  top:0px;
  left:0px;
  width:100%;
  height:5rem;
  z-index:9000;
  background-color:#3d3d3d;
  color:#ffffff;
  overflow:visible;
}

.nav-link ul {
  list-style:none;
}

.nav-link li {
  display:inline-block;
  margin-top:3rem;
  margin-bottom:1rem;
}

.nav-link li:first-child {
  margin-left:6rem;
}

.nav-link li:not(first-child){
  margin-left:4rem;
}

#navigation li a:link, #navigation li a:visited {
  text-decoration:none;
  color:#ffffff;
}

#navigation li a:hover {
  color:#fcc914;
}
</style>
