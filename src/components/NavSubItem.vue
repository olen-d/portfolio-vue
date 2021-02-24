<template>
  <div class="nav-item" v-if="navItem.children" v-on:click="toggleIsVisible">
    <router-link v-bind:to="navItem.uri">
      {{ navItem.title }}
    </router-link>
    <i class="fas fa-angle-down angle-down"></i>
    <ul v-if="navItem.children && isVisible">
      <li
        v-for="navSubItem in navItem.children"
        v-bind:key="`${navItem.title}-${navSubItem.id}`"
      >
        <router-link v-bind:to="navSubItem.uri">
          {{ navSubItem.title }}
        </router-link>
      </li>
    </ul>
  </div>
  <div class="nav-item" v-else>
    <router-link :to="navItem.uri">{{ navItem.title }}</router-link>
  </div>
</template>

<script>
export default {
  props: {
    navItem: Object
  },

  data: () => {
    // TODO: Set up the DB to include this information.
    return {
      isVisible: false
    };
  },

  methods: {
    toggleIsVisible() {
      this.isVisible = !this.isVisible;
    }
  }
};
</script>

<style scoped>
.angle-down {
  margin-left: 1rem;
}

.nav-item {
  padding-right: 2rem;
  padding-left: 2rem;
  display: inline;
  color: #ffffff;
}

.nav-item a:link,
.nav-item a:visited {
  text-decoration: none;
  color: #ffffff;
}

.nav-item a:hover {
  color: #ffffff;
}

ul li ul {
  position: absolute;
  margin-left: 0rem;
  min-width: 20rem;
  top: 4.9rem;
  left: 0rem;
  display: block;
  list-style: none;
  font-size: 100%;
}

ul li ul :hover {
  background-color: #36a0ce;
}

ul li ul li {
  width: 100%;
  margin-bottom: 0rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 2rem;
  background-color: #136a9b;
}

ul {
  /* font-size: 100%; */
  /* flex-direction: row; */
  /* align-items: center; */
  /* list-style: none;
  margin-top: 0rem;
  margin-bottom: 0rem;
  background-color: #666; */
}

ul li {
  /* display: block; */
}

ul li ul {
  /* display: block; */
  /* display: flex; */
  /* flex-direction: column; */
  /* background-color: #777; */
}

li {
  /* text-align: left; */
  /* display: block; */
  /* margin-top: 0rem; */
  /* margin-right: 0rem; */
  /* margin-bottom: 3rem; */
  /* margin-left: 0rem; */
  /* color: #ffffff;
  background-color: #888; */
}
</style>
