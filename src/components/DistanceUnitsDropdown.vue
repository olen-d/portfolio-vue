<template>
  <select name="distance-units" v-model="distanceUnit" @change="onChange">
    <option v-for="{ _id, name } in units" :key="_id" :value="_id">
      {{ name }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    defaultUnits: String,
    defaultOptions: Array
  },

  data: function() {
    return {
      units: this.defaultOptions,
      distanceUnit: this.defaultUnits
    };
  },

  methods: {
    onChange(event) {
      this.$emit("use-distance-units", this.distanceUnit);
    }
  }
};
</script>

<style scoped></style>
