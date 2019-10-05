<template>
  <nav id="adminNavigation">
    <ul v-if="showStandard">
      <li v-for="adminLink in adminLinks" :key="adminLink.id"><router-link :to="adminLink.uri">{{adminLink.title}}</router-link></li>
    </ul>
    <NavHamburger v-if="showHamburger" v-bind:links="adminLinks" v-bind:showHamburger="showHamburger" />
    
  </nav>
</template>

<script>
import NavHamburger from "./NavHamburger";

export default {
  props: ["showStandard", "showHamburger"],

  components: {
    NavHamburger
  },

  data: () => { // TODO: Set up the DB to include this information. 
    return {
      adminLinks: [
        {id: 4, sort: 4, title: "Admin", uri: "/admin"},
        {id: 5, sort: 5, title: "Dashboard", uri: "/admin/dashboard"},
        {id: 6, sort: 6, title: "Pages", uri: "/admin/pages"},
        {id: 7, sort: 7, title: "Settings", uri: "/admin/settings"}
      ]
    }
  }
}
</script>

<style scoped>
#adminNavigation {
  display:flex;
  justify-content:space-between;
  align-items:center;
  position:fixed;
  top:0px;
  left:0px;
  width:100%;
  height:5rem;
  z-index:9000;
  background-color:#136a9b;
  color:#ffffff;
  overflow:visible;
}

#adminNavigation ul {
  list-style:none;
}

#adminNavigation li {
  display:inline-block;
  margin-top:3rem;
  margin-bottom:1rem;
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
