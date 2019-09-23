<template>
  <div id="adminDashboard" class="container">
    <div class="row">
      <div class="one columns">
        &nbsp;
      </div>
      <div class="ten columns">
        <h2>
          Dashboard
        </h2>
        <p>
          Welcome {{ $store.getters.firstName }}!
        </p>
      </div>
      <div class="one columns">
        &nbsp;
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
}
</script>
