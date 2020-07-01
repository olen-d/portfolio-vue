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
    defaultActivityStatisticPastTenses: Object,
    defaultOptions: Array
  },

  data: function() {
    return {
      activityStatistics: this.defaultOptions,
      activityStatisticPastTenses: this.defaultActivityStatisticPastTenses,
      activityStatistic: this.defaultActivityStatistic
    };
  },

  methods: {
    onChange() {
      const { activityStatistic, activityStatisticPastTenses } = this;

      const eventValues = [
        activityStatistic,
        activityStatisticPastTenses[activityStatistic]
      ];
      this.$emit("use-activity-statistics", eventValues);
    }
  }
};
</script>

<style scoped></style>
