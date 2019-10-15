<template>
  <div id="admin-pages-skills">
    <ModalConfirmCancel
      v-if="showModalConfirmCancel"
      v-bind:title = modalConfirmCancelProps.title
      v-bind:message = modalConfirmCancelProps.message 
      v-bind:confirm = modalConfirmCancelProps.confirm
      v-bind:cancel = modalConfirmCancelProps.cancel
      @cancel-action="cancelAction"
    >
    </ModalConfirmCancel>
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
                <td><i @click="deleteSkill" class="fas fa-times delete" :data-id="_id" :data-name="name"></i></td>
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
import ModalConfirmCancel from "./ModalConfirmCancel";

export default {
  name: "AdminPagesSkills",

  components: {
    AdminSkillsForm,
    ModalConfirmCancel
  },

  data: () => {
    return {
      skills: [],
      formAction: "Add",
      showModalConfirmCancel: true,
      modalConfirmCancelProps: {
        title: "Test",
        message: "Testing, 1, 2, 3...",
        confirm: "OK",
        cancel: "CANCEL"
      }
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
    },

    deleteSkill(e) {
      const skillId = e.currentTarget.getAttribute("data-id");
      const skillName = e.currentTarget.getAttribute("data-name");
      this.modalConfirmCancelProps.title = "Delete Skill";
      this.modalConfirmCancelProps.message =  `Do you really want to delete the skill: ${skillName}?`;
      this.modalConfirmCancelProps.confirm = "delete";
      this.setShowModalConfirmCancel(true);
      console.log(skillId);
    },

    setShowModalConfirmCancel(value) {
      this.showModalConfirmCancel = value;
    },

    cancelAction() {
       this.setShowModalConfirmCancel(false);
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