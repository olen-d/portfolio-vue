<template>
  <div id="adminNavContainer">
    <nav id="adminNavigation" v-if="showStandard">
      <ul>
        <li v-for="adminLink in adminLinks" :key="adminLink.id"><router-link :to="adminLink.uri">{{adminLink.title}}</router-link></li>
      </ul>
    </nav>
    <NavHamburger 
      v-if="showHamburger"
      v-bind:links="adminLinks"
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

  data: () => { // TODO: Set up the DB to include this information. 
    return {
      adminLinks: [
        {id: 5, sort: 5, title: "Administration", uri: "/admin"},
        {id: 6, sort: 6, title: "Pages", uri: "/admin/pages"},
        {id: 7, sort: 7, title: "Settings", uri: "/admin/settings"}
      ]
    }
  }
}
</script>

<style scoped>
#adminNavContainer {
  display:flex;
  align-items:center;
  position:fixed;
  top:0rem;
  left:0rem;
  width:100%;
  z-index:9000;
  background-color:#136a9b;
  color:#ffffff;
  height:6rem;
}

#adminNavigation {
  display:flex;
  justify-content:space-between;
  align-items:center;
}

#adminNavigation ul {
  display:flex;
  align-items:center;
  list-style:none;
  margin-bottom:0rem;
}

#adminNavigation li {
  margin-bottom:0rem;
  color:#ffffff;
}

#adminNavigation li:first-child {
  margin-left:6rem;
}

#adminNavigation li:not(first-child){
  margin-left:4rem;
}

#adminNavigation li a:link, #adminNavigation li a:visited {
  text-decoration:none;
  color:#ffffff;
}

#adminNavigation li a:hover {
  color:#fcc914;
}
</style>
