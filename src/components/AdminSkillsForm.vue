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
      <input v-model="skillData.priority" type="text" class="u-quarter-width" id="priority" placeholder="Number" />
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
import { mapGetters } from "vuex";

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
      },
    }
  },

  computed: {
    ...mapGetters([
      "jwt"
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
        this.skillData[e] = null;
      });
    },

    createSkill(formData) {
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/skills/create`, {
      method: "post",
      headers: {
        "Authorization": `Bearer ${this.jwt}`,
        "Content-Type": "application/json"
      },
        body: JSON.stringify(formData)
      }).then(response => {
        return response.json();
      }).then(dataObj => {
        // TODO: Make this a return an update stating great success.
        // TODO: Probably by emitting that the skill was added successfuly
        // this.$emit("skill-added", dataObj);
        this.clearSkillForm();
        this.$emit("skill-created", dataObj);
      }).catch(error => {
        return ({
          errorCode: 500,
          errorMsg: "Internal Server Error",
          errorDetail: error
        })
      });
    },

    updateSkill(formData) {
      const skillId = this.editSkillId;

      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/skills/update/${skillId}`, {
      method: "put",
      headers: {
        "Authorization": `Bearer ${this.jwt}`,
        "Content-Type": "application/json"
      },
        body: JSON.stringify(formData)
      }).then(response => {
        // TODO: put response.status in the state for the status bar
        return response.json();
      }).then(dataObj => {
        // TODO: Make this a return an update stating great success.
        // TODO: Probably by emitting that the skill was added successfuly
        // this.$emit("skill-added", dataObj);
        this.clearSkillForm();
        this.$emit("update-skills-table-row", skillId);
      }).catch(error => {
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
