<script setup>
const { company, role, technologies, link, label } = defineProps([
  'company',
  'role',
  'technologies',
  'link',
  'label',
]);
</script>

<template>
  <div class="case__information">
    <p class="case__information__detail">
      <strong class="case__information__detail__title">Company</strong>
      {{ company }}
    </p>
    <p class="case__information__detail">
      <strong class="case__information__detail__title">Role</strong>
      {{ role }}
    </p>
    <p class="case__information__detail">
      <strong class="case__information__detail__title">Technologies</strong>
      {{ technologies }}
    </p>
    <p v-if="link" class="case__information__detail">
      <strong class="case__information__detail__title">{{ label }}</strong>
      <a :href="link" target="_blank">View →</a>
    </p>
  </div>
</template>

<style scoped lang="scss">
.case__information {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10rem auto;
  max-width: 144rem;
  opacity: 0;
  transition: opacity 0.4s 1s ease;
  width: 90%;

  .mobile & {
    transition-delay: 0s;
  }

  .case--active & {
    opacity: 1;
  }

  @include media('<=phone') {
    margin: 5rem auto;
  }
}

.case__information__detail {
  font-size: 3rem;

  &:nth-child(4) {
    margin-top: 5rem;
    width: 100%;
  }

  @include media('<=phone') {
    font-size: 1.6rem;
    width: 50%;

    &:nth-child(3),
    &:nth-child(4) {
      margin-top: 2.5rem;
      width: 100%;
    }
  }
}

.case__information__detail__title {
  display: block;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
}
</style>
