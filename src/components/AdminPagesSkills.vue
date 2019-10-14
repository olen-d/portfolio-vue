<template>
  <div id="admin-pages-skills">
    <div class="container">
      <div class="row">
        <div class="one columns">
          &nbsp;
        </div>
        <div class="ten columns">
          <h3>
            Skills
          </h3>
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
      <div class="row">
        <div class="one columns">
          &nbsp;
        </div>
        <div class="ten columns">
          <table>
            <thead>
              <tr>
                <th scope="col">Icon</th>
                <th scope="col">Skill</th>
                <th scope="col">Type</th>
                <th scope="col">Description</th>
                <th scope="col">Sort Priority</th>
                <th scope="col">Display</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody id="skills">
              <tr v-for="{ _id, type, name, description, show, icon, priority } in skills" :key="_id" :id="_id">
                <td><i :class="icon" class="table-icon"></i></td>
                <td>{{ name }}</td>
                <td>{{ type }}</td>
                <td>{{ description }}</td>
                <td>{{ priority }}</td>
                <td>{{ formatShow(show) }}</td>
                <td><i class="fas fa-edit edit" :data-id="_id"></i></td>
                <td><i class="fas fa-times delete" :data-id="_id"></i></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
      <div class="row">
        <div class="one columns">
          &nbsp;
        </div>
        <div class="ten columns">
          <AdminSkillsForm
            v-bind:formAction="formAction"
            @update-skills-table="updateSkillsTable"
          >
          </AdminSkillsForm>
        </div>
        <div class="one columns">
          &nbsp;
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import AdminSkillsForm from "./AdminSkillsForm";

export default {
  name: "AdminPagesSkills",

  components: {
    AdminSkillsForm
  },

  data: () => {
    return {
      skills: [],
      formAction: "Add"
    }
  },

  computed: {
    ...mapGetters([ "firstName" ])
  },

  methods: {
    formatShow: show => {
      if (show == 1) {
        return "Yes";
      } else {
        return "No";
      }
    },

    updateSkillsTable(e) {
      this.skills.push(e);
    }
  },

  created() {
    fetch("https://www.olen.dev/api/skills/all")
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.skills = json.skills;
    });
  }
}
</script>

<style scoped>
textarea {
  height:16rem;
}
</style>