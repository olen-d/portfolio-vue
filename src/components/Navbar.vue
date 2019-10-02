<template>
  <nav id="navigation">
    <ul v-if="showStandard && showFrontEnd">
      <li v-for="link in links" :key="link.id"><router-link :to="link.uri">{{link.title}}</router-link></li>
    </ul>
    <NavbarAdmin  v-if="showStandard && showAdmin" />
    <NavHamburger v-if="showHamburger && showFrontEnd" v-bind:links="links" v-bind:showHamburger="showHamburger" />
  </nav>
</template>

<script>
import NavbarAdmin from "./NavbarAdmin";
import NavHamburger from "./NavHamburger";

export default {
  components: {
    NavbarAdmin,
    NavHamburger
  },

  data: () => { // TODO: Set up the DB to include this information. Remember, only the links are coming from the DB. Window is coded here.
    return {
      links: [
        {id: 0, sort: 0, title: "Home", uri: "/home"},
        {id: 1, sort: 1, title: "About", uri: "/about"},
        {id: 2, sort: 2, title: "Projects", uri: "/projects"},
        {id: 3, sort: 3, title: "Contact", uri: "/contact"},
      ],

      window: {
          width: 0,
          height: 0
      }
    }
  },

  computed: {
    showFrontEnd: function() {
      return !this.$store.getters.administrator;
    },

    showStandard: function() {
      return this.window.width >= 500;
    },
    showHamburger: function() {
      return this.window.width < 500;
    },
    showAdmin: function() {
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

#navigation ul {
  list-style:none;
}

#navigation li {
  display:inline-block;
  margin-top:3rem;
  margin-bottom:1rem;
}

#navigation li:first-child {
  margin-left:6rem;
}

#navigation li:not(first-child){
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
