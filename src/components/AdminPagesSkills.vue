<template>
  <div class="admin-pages-skills">
    <ModalConfirmCancel
      v-if="showModalConfirmCancel"
      v-bind:payload = modalConfirmCancelProps.payload
      v-bind:action = modalConfirmCancelProps.action
      v-bind:title = modalConfirmCancelProps.title
      v-bind:message = modalConfirmCancelProps.message 
      v-bind:confirm = modalConfirmCancelProps.confirm
      v-bind:cancel = modalConfirmCancelProps.cancel
      @confirm-action="confirmAction"
      @cancel-action="cancelAction"
    >
    </ModalConfirmCancel>
    <h3>
      Skills
    </h3>
    <button @click="handleShowFormSkills('add')">
      Add Skill
    </button>
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
          <td>{{ show }}</td>
          <td><i @click="updateSkill" class="fas fa-edit edit" :data-id="_id"></i></td>
          <td><i @click="confirmDeleteSkill" class="fas fa-times delete" :data-id="_id" :data-name="name"></i></td>
        </tr>
      </tbody>
    </table>
    <AdminSkillsForm
      v-bind:formAction="formAction"
      v-bind:editSkillId="editSkillId"
      v-bind:updateSkillData="updateSkillData"
      @skill-created="skillCreated"
      @skill-updated="skillUpdated"
      @cancel-edit-skill="cancelEditSkill"
    >
    </AdminSkillsForm>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import AdminSkillsForm from "./AdminSkillsForm.vue";
import ModalConfirmCancel from "./ModalConfirmCancel.vue";

export default {
  name: "AdminPagesSkills",

  components: {
    AdminSkillsForm,
    ModalConfirmCancel
  },

  data: () => {
    return {
      skills: [],
      formAction: "add",
      editSkillId: "",
      updateSkillData: {},
      showModalConfirmCancel: false,
      modalConfirmCancelProps: {
        payload: {
          action: "",
          data: ""
        },
        title: "",
        message: "",
        confirm: "ok",
        cancel: "cancel"
      }
    }
  },

  computed: {
    ...mapGetters(["jwt"])
  },

  methods: {
    handleShowFormSkills(action) {
      this.formAction = action
    },

    findSkillIndexById(skillId) {
      const index = this.skills.map(item => item._id).indexOf(skillId);
      return index;
    },

    createSkillsTableRow(e) {
      this.skills.push(e);
    },

    skillCreated(e) {
      if (e._id) {
        this.createSkillsTableRow(e);
        // TODO: Update status bar with success result
      } else {
        // TODO: Update status bar with fail result
      }
    },

    updateSkillsTableRow(skillId) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/id/${skillId}`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          const updatedSkillData = json.skill;
          const index = this.findSkillIndexById(skillId);

          this.skills.splice(index, 1, updatedSkillData);

          this.formAction = "add";
          this.editSkillId = "";
          this.updateSkillData = {}
        });
    },

    skillUpdated(skillId) {
      this.updateSkillsTableRow(skillId);
      // Update status bar with result
    },

    deleteSkillsTableRow(skillId) {
      const index = this.findSkillIndexById(skillId);
      if (index > -1) {
        this.skills.splice(index, 1);
      }
    },

    readSkills() {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.skills = json.skills;
        });
    },

    confirmDeleteSkill(e) {
      const skillId = e.currentTarget.getAttribute("data-id");
      const skillName = e.currentTarget.getAttribute("data-name");

      this.modalConfirmCancelProps.payload.action = "delete";
      this.modalConfirmCancelProps.payload.data = skillId;
      this.modalConfirmCancelProps.title = "Delete Skill";
      this.modalConfirmCancelProps.message =  `Do you really want to delete the skill: ${skillName}?`;
      this.modalConfirmCancelProps.confirm = "delete";

      this.setShowModalConfirmCancel(true);
    },

    updateSkill(e) {
      const skillId = e.currentTarget.getAttribute("data-id");
      const skillIndex = this.findSkillIndexById(skillId);
      const skill = { ...this.skills[skillIndex] }; // Clone the current skill object

      delete skill._id;
      delete skill.userId;

      this.updateSkillData = skill;
      this.formAction = "edit";
      this.editSkillId = skillId;
    },

    deleteSkill(skillId) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/delete`, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ skillId: skillId })
      })
        .then(response => {
          return response.json();
        })
        .then(dataObj => {
          const { ok, deletedCount } = dataObj;
          if (ok === 1 && deletedCount === 1) {
            this.$store.commit("setStatusCategory", "success");
            this.$store.commit("setStatusMessage", "Skill deleted successfully.");
            this.deleteSkillsTableRow(skillId);
          } else {
            this.$store.commit("setStatusCategory", "error");
            this.$store.commit("setStatusMessage", "Skill was not deleted. Database error. ");
          }
        })
        .catch(error => {
          this.$store.commit("setStatusCategory", "error");
          this.$store.commit("setStatusMessage", "Skill was not deleted. " + error);
          return {
            errorCode: 500,
            errorMsg: "Internal Server Error",
            errorDetail: error
          };
        });
    },

    cancelEditSkill() {
      this.formAction = "add";
    },

    setShowModalConfirmCancel(value) {
      this.showModalConfirmCancel = value;
    },

    cancelAction() {
      this.setShowModalConfirmCancel(false);
    },

    confirmAction(v) {
      switch (v.action) {
        case "delete":
          this.deleteSkill(v.data);
          break;
      }
      this.setShowModalConfirmCancel(false);
    }
  },

  created() {
    this.readSkills();
  }
}
</script>

<style scoped>
textarea {
  height: 16rem;
}
</style>
