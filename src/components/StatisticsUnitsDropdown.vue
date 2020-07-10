<template>
  <span class="statistics-units">
    &nbsp;
    <select name="statistics-units" v-model="statisticsUnit" @change="onChange">
      <option
        v-for="{ _id, name } in statisticsUnitsOptions"
        :key="_id"
        :value="_id"
      >
        {{ name }}
      </option>
    </select>
    &nbsp;
  </span>
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
      } else if (activityStatistic === "movingTime") {
        return [{ _id: "elapsedTime", name: "elapsed time " }];
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
  },

  // Force the units to change when the prop is changed in the parent.
  watch: {
    defaultStatisticUnit: function() {
      this.statisticsUnit = this.defaultStatisticUnit;
    }
  }
};
</script>

<style scoped></style>
