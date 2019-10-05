<template>
  <nav id="navbarFrontEnd">
    <ul v-if="showStandard">
      <li v-for="link in links" :key="link.id"><router-link :to="link.uri">{{link.title}}</router-link></li>
    </ul>
    <NavHamburger v-if="showHamburger" v-bind:links="links" v-bind:showHamburger="showHamburger" />
  </nav>
</template>

<script>
import NavHamburger from "./NavHamburger";

export default {
  props: ["showStandard", "showHamburger"],

  components: {
    NavHamburger
  },

  data: () => { // TODO: Set up the DB to include this information. Remember, only the links are coming from the DB. Window is coded here.
    return {
      links: [
        {id: 0, sort: 0, title: "Home", uri: "/home"},
        {id: 1, sort: 1, title: "About", uri: "/about"},
        {id: 2, sort: 2, title: "Projects", uri: "/projects"},
        {id: 3, sort: 3, title: "Contact", uri: "/contact"},
      ]
    }
  },    
}
</script>

<style scoped>
#navbarFrontEnd {
  display:flex;
  justify-content:space-between;
  align-items:center;
  position:fixed;
  top:0px;
  left:0px;
  height:5rem;
  width:100%;
  z-index:9000;
  overflow:visible;
  background-color:#3d3d3d;
  color:#ffffff;
}

#navbarFrontEnd ul {
  list-style:none;
}

#navbarFrontEnd li {
  display:inline-block;
  margin-top:3rem;
  margin-bottom:1rem;
}

#navbarFrontEnd li:first-child {
  margin-left:6rem;
}

#navbarFrontEnd li:not(first-child) {
  margin-left:4rem;
}

#navbarFrontEnd li a:link, 
#navbarFrontEnd li a:visited {
  color:#ffffff;
  text-decoration:none;
}

#navbarFrontEnd li a:hover {
  color:#fcc914;
  text-decoration:none;
}
</style>
