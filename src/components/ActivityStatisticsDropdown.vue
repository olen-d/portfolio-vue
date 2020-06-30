<template>
  <select
    name="activity-statistics"
    v-model="activityStatistic"
    @change="onChange"
  >
    <option v-for="{ _id, name } in activityStatistics" :key="_id" :value="_id">
      {{ name }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    defaultActivityStatistic: String,
    defaultOptions: Array
  },

  data: function() {
    return {
      activityStatistics: this.defaultOptions,
      activityStatistic: this.defaultActivityStatistic
    };
  },

  methods: {
    onChange() {
      this.$emit("use-activity-statistics", this.activityStatistic);
    }
  }
};
</script>

<style scoped></style>
