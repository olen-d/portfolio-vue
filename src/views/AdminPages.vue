<template>
  <div class="admin-pages">
    <h2>
      Pages
    </h2>
    <nav>
      <ul>
        <li>
          <router-link :to="{ name: 'adminPagesWelcome' }">
            Welcome
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'adminPagesProjects' }">
            Projects
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'adminPagesSkills' }">Skills</router-link>
        </li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>
