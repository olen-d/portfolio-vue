<template>
  <div id="navContainer">
    <nav id="navbarFrontEnd" v-if="showStandard">
      <ul>
        <li v-for="link in links" :key="link.id"><router-link :to="link.uri">{{link.title}}</router-link></li>
      </ul>
    </nav>
    <NavHamburger 
      v-if="showHamburger" 
      v-bind:links="links" 
      v-bind:showHamburger="showHamburger"
    >
    </NavHamburger>
  </div>
</template>

<script>
import NavHamburger from "./NavHamburger";

export default {
  props: {
    showStandard: Boolean, 
    showHamburger: Boolean
  },

  components: {
    NavHamburger
  },
// TODO: Change uri to named path
  data: () => { // TODO: Set up the DB to include this information. Remember, only the links are coming from the DB. Window is coded here.
    return {
      links: [
        {id: 0, sort: 0, title: "Home", uri: "/home"},
        {id: 1, sort: 1, title: "About", uri: "/about"},
        {id: 2, sort: 2, title: "Projects", uri: "/projects"},
        {id: 3, sort: 3, title: "Contact", uri: "/contact"},
        {id: 4, sort: 4, title: "TEST", uri: "/test"}
      ]
    }
  },    
}
</script>

<style scoped>
#navContainer{
  display:flex;
  align-items:center;
  position:fixed;
  top:0rem;
  left:0rem;
  width:100%;
  z-index:9000;
  background-color:#3d3d3d;
  color:#ffffff;
  height:6rem;
}

#navbarFrontEnd {
  display:flex;
  justify-content:space-between;
  align-items:center;
}

#navbarFrontEnd ul {
  display:flex;
  align-items:center;
  list-style:none;
  margin-bottom:0rem;
}

#navbarFrontEnd li {
  margin-bottom:0rem;
  color:#ffffff;
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
