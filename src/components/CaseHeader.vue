<script setup>
const { id, title } = defineProps(['id', 'title']);
</script>

<template>
  <header class="case__header">
    <h3 class="case__title">
      <span class="case__title__text">{{ title }}</span>
    </h3>
    <figure class="case__media">
      <img :src="`/projects/${id}.webp`" alt="" class="case__media__image" />
    </figure>
  </header>
</template>

<style scoped lang="scss">
.case__media {
  position: relative;
  width: 100%;

  &:after {
    content: '';
    display: inline-block;
    padding-top: calc(768 / 1366 * 100%);
    width: 100%;
  }
}

.case__media__image {
  @extend %cover;

  opacity: 0.25;
  transition: opacity 1.5s $ease-out-expo;

  .mobile .case--active & {
    opacity: 1;
  }
}

.case__header__content {
  text-align: center;
  margin: auto;
  width: 40%;
}

.case__title {
  font: 15rem/0.8 $font-ampersand;
  overflow: hidden;
  padding: 0 1rem;
  position: relative;
  text-align: center;
  transform: translateY(50%);
  white-space: nowrap;
  z-index: 1;

  @include media('<=phone') {
    font-size: 5rem;
    white-space: inherit;
  }
}

.case__title__text {
  display: block;
  transform: translateY(100%);
  transition: transform 1.5s 1s $ease-out-expo;

  .mobile & {
    transition-delay: 0s;
  }

  .case--active & {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
