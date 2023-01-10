<template>
  <div class="card-brief-project card u-pull-left">
    <div class="card-brief-project-screenshot">
      <slot name="screenshot"></slot>
    </div>
    <div class="card-brief-project-title">
      <slot name="title"></slot>
    </div>
    <div class="card-brief-project-description">
      <slot name="description"></slot>
    </div>
    <div class="card-brief-project-links">
      <div class="card-brief-project-link-deployed">
        <slot name="link-deployed"></slot>
      </div>
      <div class="card-brief-project-link-repo">
        <slot name="link-repo"></slot>
      </div>
    </div>
    <div class="card-brief-project-footer">
        <slot name="call-to-action"></slot>
    </div>
  </div>
</template>

<style scoped>
  .card-brief-project {
    width: 335px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .card-brief-project-footer {
    justify-self: center;
  }
  .card-brief-project-link-deployed,
  .card-brief-project-link-repo {
    display: inline;
  }
</style>
