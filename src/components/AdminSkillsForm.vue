<template>
  <div id="admin-skills-form">
    <h3>{{ formAction }} a Skill</h3>
    <form id="skills-form">
      <label for="name">Name</label>
      <input v-model="skillData.name" type="text" class="u-full-width" id="name" placeholder="The name of the skill" required />
      <label for="type">Type</label>
      <input v-model="skillData.type" type="text" class="u-full-width" id="type" placeholder="The category of the skill (e.g. database, framework, library)" required />
      <label for="description">Description</label>
      <textarea class="u-full-width" id="description" v-model="skillData.description" placeholder="Briefly explain the skill and provide an example of how you used it..."></textarea>
      <label for="icon">Icon</label>
      <input v-model="skillData.icon" type="text" class="u-half-width" id="icon" placeholder="Icon style and name" />
      <label for="priority">Sort Priority</label>
      <input v-model="skillData.priority" type="number" class="u-quarter-width" id="priority" placeholder="Number" />
      <label for="show">Display Skill?</label>
      <select v-model="skillData.show" class="u-quarter-width" id="show">
        <option disabled value="">Select one...</option>
        <option value="1">Yes</option>
        <option value="0">No</option>
      </select>
      <div class="right">
        <button v-on:click.prevent="submitSkillForm" class="button-primary" id="skill-submit">{{ formAction }} Skill</button>
        <button v-if="formAction === 'Edit'" v-on:click.prevent="cancelEditSkill" class="edit-button-cancel">cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  props: {
    formAction: String,
    editSkillId: String,
    updateSkillData: Object,
  },

  data () {
    return {
      skillData: {
        name: "",
        type: "",
        description: "",
        icon: "",
        priority: null,
        show: ""
      }
    }
  },

  computed: {
    ...mapGetters([
      "jwt"
    ]),

    ...mapState([
      "statusCategory",
      "statusMessage"
    ])
  },

  watch: {
    editSkillId(newValue) {
      if (this.formAction === "Edit") {
        this.skillData = JSON.parse(JSON.stringify(this.updateSkillData));
      }
    }
  },

  methods: {
    submitSkillForm() {
      const userId = this.$store.getters.userId;
      const { name, type, description, icon, priority, show } = this.skillData;
      const showInt = parseInt(show);

      const formData = {
        userId: userId,
        type: type,
        name: name,
        description: description,
        show: showInt,
        icon: icon,
        priority: priority
      }

      if (this.formAction === "Add") {
        this.createSkill(formData);
      } else if (this.formAction === "Edit") {
        this.updateSkill(formData);
      }
    },

    cancelEditSkill() {
      this.clearSkillForm();
      this.$emit("cancel-edit-skill");
      },

    clearSkillForm() {
      const keys = Object.keys(this.skillData);

      keys.forEach(e => {
        this.skillData[e] = "";
      });
    },

    createSkill(formData) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/create`, {
      method: "post",
      headers: {
        "Authorization": `Bearer ${this.jwt}`,
        "Content-Type": "application/json"
      },
        body: JSON.stringify(formData)
      }).then(response => {
        return response.json();
      }).then(dataObj => {
        if (dataObj._id) {
          this.$store.commit("setStatusCategory", "success");
          this.$store.commit("setStatusMessage", "Skill created successfully.");
          this.$emit("skill-created", dataObj);
          this.clearSkillForm();
        } else {
          this.$store.commit("setStatusCategory", "error");
          this.$store.commit("setStatusMessage", "Skill was not created. Database error. ");          
        }
      }).catch(error => {
        this.$store.commit("setStatusCategory", "error");
        this.$store.commit("setStatusMessage", "Skill was not created. " + error);
        return ({
          type: "error",
          message: "Internal server error.",
          error: error
        })
      });
    },

    updateSkill(formData) {
      const skillId = this.editSkillId;

      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/update/${skillId}`, {
      method: "put",
      headers: {
        "Authorization": `Bearer ${this.jwt}`,
        "Content-Type": "application/json"
      },
        body: JSON.stringify(formData)
      }).then(response => {
        return response.json();
      }).then(dataObj => {
        if(dataObj.n === 1 && dataObj.ok === 1) {
          this.$store.commit("setStatusCategory", "success");
          this.$store.commit("setStatusMessage", "Skill updated successfully.");
          this.$emit("skill-updated", skillId);
          this.clearSkillForm();
        } else {
          this.$store.commit("setStatusCategory", "error");
          this.$store.commit("setStatusMessage", "Skill was not updated. Database error. ");
        }
      }).catch(error => {
        this.$store.commit("setStatusCategory", "error");
        this.$store.commit("setStatusMessage", "Skill was not updated. " + error);
        return ({
          errorCode: 500,
          errorMsg: "Internal Server Error",
          errorDetail: error
        })
      });
    }
  }
}
</script>

<style scoped>
.edit-button-cancel {
  margin-left:1rem;
}
</style>
