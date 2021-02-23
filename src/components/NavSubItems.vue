<template>
  <ul>
    <li v-for="navSubItem in navSubItems" :key="navSubItem.id">
      <router-link :to="navSubItem.uri">{{ navSubItem.title }}</router-link>
    </li>
  </ul>
</template>

<script>
import NavHamburger from "./NavHamburger";

export default {
  props: {
    show: Boolean,
    navSubItems: Array
  },

  components: {
    NavHamburger
  },

  data: () => {
    // TODO: Set up the DB to include this information.
    return {
      //
    };
  }
};
</script>

<style scoped>
#adminNavContainer {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0rem;
  left: 0rem;
  width: 100%;
  z-index: 9000;
  background-color: #136a9b;
  color: #ffffff;
  height: 6rem;
}

#adminNavigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#adminNavigation ul {
  display: flex;
  align-items: center;
  list-style: none;
  margin-bottom: 0rem;
}

#adminNavigation li {
  margin-bottom: 0rem;
  color: #ffffff;
}

#adminNavigation li:first-child {
  margin-left: 6rem;
}

#adminNavigation li:not(first-child) {
  margin-left: 4rem;
}

#adminNavigation li a:link,
#adminNavigation li a:visited {
  text-decoration: none;
  color: #ffffff;
}

#adminNavigation li a:hover {
  color: #fcc914;
}
</style>
