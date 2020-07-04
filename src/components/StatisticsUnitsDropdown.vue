<template>
<div>
  <p>D: {{ defaultStatisticUnit }}</p>
  <select name="statistics-units" v-model="statisticsUnit" @change="onChange">
    <option
      v-for="{ _id, name } in statisticsUnitsOptions"
      :key="_id"
      :value="_id"
    >
      {{ name }}
    </option>
  </select>
  </div>
</template>

<script>
export default {
  props: {
    activityStatistic: String,
    defaultStatisticUnit: String
  },

  data: function() {
    return {
      statisticsUnit: this.defaultStatisticUnit
    };
  },

  computed: {
    statisticsUnitsOptions: function() {
      const { activityStatistic } = this;
      if (activityStatistic === "distance") {
        return [
          { _id: "mi", name: "miles" },
          { _id: "km", name: "kilometers" }
        ];
      } else if (activityStatistic === "elevationGain") {
        return [{ _id: "ft", name: "feet" }, { _id: "m", name: "meters" }];
      } else {
        return "error";
      }
    }
  },

  methods: {
    onChange() {
      this.$emit("use-statistics-units", this.statisticsUnit);
    }
  }
};
</script>

<style scoped></style>
