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
      <label for="display">Display Skill?</label>
      <select v-model="skillData.display" class="u-quarter-width" id="display">
        <option value="1">Yes</option>
        <option value="0">No</option>
      </select>
      <div class="right">
        <button v-on:click.prevent="submitSkillForm" class="button-primary" id="headline-submit">{{ formAction }} Skill</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: ["formAction"],

  data: () => {
    return {
      skillData: {
        name: "",
        type: "",
        description: "",
        icon: "",
        priority: "",
        display: ""
      },
    }
  },

  methods: {
    submitSkillForm() {
      const userId = this.$store.getters.userId;
      const { name, type, description, icon, priority, display } = this.skillData;
      const show = parseInt(display);

      const formData = {
        userId: userId,
        type: type,
        name: name,
        description: description,
        show: show,
        icon: icon,
        priority: priority
      }

      fetch("https://www.olen.dev/api/skills/create", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
        body: JSON.stringify(formData)
      }).then(response => {
        return response.json();
      }).then(dataObj => {
        // TODO: Make this a modal stating great success.
        // TODO: Probably by emitting that the skill was added successfuly
        // this.$emit("skill-added", dataObj);
        // TODO: Clear the form
        this.$emit("update-skills-table", dataObj);
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

</style>