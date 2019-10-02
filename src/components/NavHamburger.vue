<template>
  <nav>
    <span v-on:click="toggleDropDownMenu" id="hamburger" class="fas fa-bars"></span>
    <div id="dropDownContainer">
      <ul v-if="visible && showHamburger">
        <li v-for="link in links" :key="link.id"><router-link :to="link.uri">{{link.title}}</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  props: ["links", "showHamburger"],

  data: () => {
    return {
      visible: false
    }
  },

  methods: {
    toggleDropDownMenu() {
      this.visible = !this.visible;
    }
  },

  created() {
    let self = this;
    window.addEventListener("click", function(e) {
      if(!self.$el.contains(e.target)){
        self.visible = false;
      }
    });

    window.addEventListener("touchstart", function(e) {
      if(!self.$el.contains(e.targetTouches[0].target)){
        self.visible = false;
      }
    });
  }
}
</script>

<style scoped>
#hamburger {
  margin:1.5rem 6rem 1rem 6rem;
}

#dropDownContainer {
  position:fixed;
  top:5rem;
  left:0px;
  width:100%;
  z-index:8950;
  background-color:#3d3d3d;
  color:#ffffff;
  overflow:hidden;
}

#dropDownContainer ul {
  list-style:none;
}

#dropDownContainer li {
  margin-left:6rem;
  margin-top:3rem;
  margin-bottom:3rem;
}

#dropDownContainer li:last-child {
  margin-bottom:4.5rem;
}

#dropDownContainer li a:link, 
#dropDownContainer li a:visited {
  text-decoration:none;
  color:#ffffff;
}

#dropDownContainer li a:hover {
  color:#fcc914;
}
</style>
