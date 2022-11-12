<script setup>
  import { ref } from 'vue'

  import TheNavHamburger from '@/components/TheNavHamburger.vue'
  import NavSubItem from '@/components/NavSubItem.vue'

  const props = defineProps({
    showStandard: {
      type: Boolean
    },
    showHamburger: {
      type: Boolean
    }
  })

  // TODO: Set up the DB to include this information.
  const adminLinks = ref(
    [
      {
        id: 5,
        sort: 5,
        title: "Administration",
        uri: "/admin"
      },
      {
        id: 6,
        sort: 6,
        title: "Pages",
        uri: "/admin/pages",
        children: [
          {
            id: 7,
            sort: 7,
            title: "Welcome",
            uri: "/admin/pages/welcome"
          },
          {
            id: 8,
            sort: 8,
            title: "Projects",
            uri: "/admin/pages/projects"
          },
          {
            id: 9,
            sort: 9,
            title: "Skills",
            uri: "/admin/pages/skills"
          }
        ]
      },
      {
        id: 10,
        sort: 10,
        title: "Settings",
        uri: "/admin/settings"
      }
    ]
  )
</script>

<template>
  <div class="admin-nav-container">
    <nav class="admin-navigation" v-if="showStandard">
      <ul>
        <li v-for="adminLink in adminLinks" :key="adminLink.id">
          <NavSubItem :navItem="adminLink" />
        </li>
      </ul>
    </nav>
    <TheNavHamburger
      v-if="showHamburger"
      :links="adminLinks"
      :showHamburger="showHamburger"
    />
  </div>
</template>

<style scoped>
  li {
    display: block;
    float: left;
    position: relative;
    margin-top: 0rem;
    margin-bottom: 0rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  li:hover {
    display: block;
    background-color: #36a0ce;
  }

  .admin-navigation {
    position: fixed;
    top: 0rem;
    left: 0rem;
    width: 100%;
    z-index: 9000;
    margin-top: 0rem;
    margin-bottom: 0rem;
    padding-top: 0rem;
    padding-bottom: 0rem;
    background-color: #136a9b;
  }

  .admin-navigation li:first-child {
    margin-left: 6rem;
  }

  .admin-navigation li:not(first-child) {
    margin-left: 0rem;
  }
</style>
