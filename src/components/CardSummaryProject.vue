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
        <slot name="call-to-action"></slot>
    </div>
  </div>
</template>

<style scoped>
  .card-summary-project {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
  }
  .card-summary-project-footer {
    justify-self: center;
  }
  .card-summary-project-link-deployed,
  .card-summary-project-link-repo {
    display: inline;
  }
  .card-summary-project-links {
    justify-self: center;
  }

  @media (min-width: 1024px) {
    .card-summary-project {
      justify-items: start;
      grid-template-columns: 350px 1fr;
      column-gap: 8rem;
    }
    .card-summary-project-footer {
    justify-self: start;
  }
    .card-summary-project-links {
    justify-self: start;
  }
    .card-summary-project-title {
      grid-column-start: 2;
    }
    .card-summary-project-screenshot {
    grid-row-start: span 4;
    }
  }
</style>
