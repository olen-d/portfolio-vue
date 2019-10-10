<template>
  <div id="admin-pages">
    <div class="container">
      <div class="row">
        <div class="one columns">
          &nbsp;
        </div>
        <div class="ten columns">
          <h2>
            Pages
          </h2>
          <nav>
            <ul>
              <li><router-link :to="{ name: 'adminPagesWelcome' }">Welcome</router-link></li>
            </ul>
          </nav>
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
    </div>
    <router-view>
    </router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AdminPages",

  computed: {
    ...mapGetters([ "firstName" ])
  }
}
</script>
