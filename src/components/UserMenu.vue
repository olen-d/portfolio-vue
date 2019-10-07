<template>
  <div>
    <div id="userMenu">
      <span v-on:click="toggleUserMenuDropdown" id="userMenuLink"><i class="fas fa-user"></i><i id="userMenuDown" class="fas fa-angle-down"></i></span>
    </div>
    <div v-if="visible" id="userMenuDropdown">
      <ul>
        <li><a @click="logout" class="fake-menu-link">Logout</a></li>
        <li v-for="link in links" :key="link.id"><router-link :to="link.uri">{{link.title}}</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {

  data: () => {
    return {
      links: [
        {id: 0, sort: 0, title: "My Profile", uri: "/profile"},
      ],
      visible: false
    }
  },

  methods: {
    toggleUserMenuDropdown() {
      this.visible = !this.visible;
    },
  
    logout() {
      this.$store.commit("setDoLogout", true);
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

<style>
#userMenu {
  display:flex;
  align-items:center;
  position:fixed;
  top:0px;
  right:0px;
  height:6rem;
  margin-right:4rem;
  z-index:9500;
  color:#ffffff;
}

#userMenuDown {
  margin-left:1rem;
}

#userMenuDropdown {
  position:fixed;
  top:6rem;
  right:0px;
  z-index:8900;
  padding-right:4rem;
  background-color:#3d3d3d;
}

#userMenuDropdown ul {
  list-style:none;
}

#userMenuDropdown li {
  margin-left:3rem;
  margin-top:3rem;
  margin-bottom:3rem;
}

#userMenuDropdown li:last-child {
  margin-bottom:4.5rem;
}

#userMenuDropdown li a:link, 
#userMenuDropdown li a:visited {
  text-decoration:none;
  color:#ffffff;
}

#userMenuDropdown li a:hover {
  color:#fcc914;
}
</style>
