<script setup>
import { ref } from 'vue'

const isDisabled = ref(true)
</script>

<template>
  <div class="card-summary-project">
    <div class="card-summary-project-screenshot">
      <slot name="screenshot"></slot>
    </div>
    <div class="card-summary-project-title">
      <slot name="title"></slot>
    </div>
    <div class="card-summary-project-description">
      <slot name="description"></slot>
    </div>
    <div class="card-summary-project-links">
      <div class="card-summary-project-link-deployed">
        <slot name="link-deployed"></slot>
      </div>
      <div class="card-summary-project-link-repo">
        <slot name="link-repo"></slot>
      </div>
    </div>
    <div class="card-summary-project-footer">
      <button
        :disabled = "isDisabled"
        @click.prevent="handleClick"
        class="button-primary"
      >
        <slot name="card-summary-project-call-to-action">Learn More</slot>
      </button>
    </div>
  </div>
</template>

  <style scoped>
    .card-summary-project {
      display: grid;
      grid-template-columns: 350px 1fr;
      justify-items: start;
    }
    .card-summary-project-footer {
      justify-self: center;
    }
    .card-summary-project-title {
      grid-column-start: 2;
    }
    .card-summary-project-links {
      margin-right: 8rem;
      margin-left: 8rem;
    }
    .card-summary-project-link-deployed,
    .card-summary-project-link-repo {
      display: inline;
    }
    .card-summary-project-screenshot {
      grid-row-start: span 4;
    }
</style>
