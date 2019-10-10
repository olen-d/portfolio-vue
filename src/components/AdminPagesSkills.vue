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
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AdminPagesSkills",

  data: () => {
    return {
      skills: [],
    }
  },

  computed: {
    ...mapGetters([ "firstName" ])
  },

  methods: {
    submitHeadlineForm () {
      const welcomeId = this.welcome._id
      const formData = {
        headline: this.welcome.headline,
      }

      fetch(`https://www.olen.dev/api/welcome/update/headline/${welcomeId}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }).then(response => {
        return response.json();
      }).then(dataObj => {
        console.log("DATA OBJ\n", dataObj);
      });
    },
    
    formatShow: show => {
      if (show == 1) {
        return "Yes";
      } else {
        return "No";
      }
    }
  },

  created() {
    fetch("https://www.olen.dev/api/skills")
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