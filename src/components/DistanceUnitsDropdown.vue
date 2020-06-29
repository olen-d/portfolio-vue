<template>
  <select name="statistics-units" v-model="statisticsUnit" @change="onChange">
    <option v-for="{ _id, name } in statisticsUnitsOptions" :key="_id" :value="_id">
      {{ name }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    activityStatistic: String
  },

  data: function() {
    return {
      statisticsUnit: this.defaultUnits
    };
  },

  computed: {
    statisticsUnitsOptions: function() {
      const { activityStatistic } = this;
      if (activityStatistic === "distance") {
        this.setDefaultStatisticsUnits("mi");
        return [
          { _id: "mi", name: "miles" },
          { _id: "km", name: "kilometers" }
        ];
      } else if (activityStatistic === "elevation") {
        this.setDefaultStatisticsUnits("ft");
        return [{ _id: "ft", name: "feet" }, { _id: "m", name: "meters" }];
      } else {
        return "error";
      }
    }
  },

  methods: {
    onChange() {
      this.$emit("use-distance-units", this.statisticsUnit);
    },

    setDefaultStatisticsUnits(units) {
      this.statisticsUnit = units;
      this.$emit("use-distance-units", units);
    }
  }
};
</script>

<style scoped></style>
