<script setup></script>

<template>
  <header class="about__header">
    <h1 class="about__header__title">
      <span class="about__header__title__text">
        <span>LUIS</span>
        <span>BIZARRØ</span>
      </span>
      <span class="about__header__title__text">
        <span>18/SEP 95</span>
        <span> -</span>
        <span>BR</span>
      </span>
      <span class="about__header__title__text">
        <span>+</span>
        <span>CREATIVE</span>
      </span>
      <span class="about__header__title__text">
        <span>TECHNOLOGIST</span>
      </span>
    </h1>
  </header>
</template>

<style scoped lang="scss">
.about__header {
  height: 94rem;
  margin-bottom: 20rem;
  text-align: center;

  @include media('<=phone') {
    height: 19rem;
    margin-bottom: 5rem;
  }
}

.about__header__title {
  font: 24rem/1 $font-ampersand;
  display: inline-block;
  text-align: left;

  @include media('<=phone') {
    font-size: 5.5rem;
  }
}

.about__header__title__text {
  display: flex;
  justify-content: space-between;
  overflow: hidden;

  span {
    transform: translateY(100%);
    transition-delay: 1s;
  }

  &:not(:first-child) {
    margin-top: -6rem;
  }

  @include media('<=phone') {
    &:not(:first-child) {
      margin-top: -1rem;
    }
  }
}

.about--active {
  .about__header__title__text span {
    transform: translateY(0);
  }

  .about__header__title__text:nth-child(1) span {
    transition: transform 1.5s $ease-out-expo;
  }

  .about__header__title__text:nth-child(2) span {
    transition: transform 1.5s 0.2s $ease-out-expo;
  }

  .about__header__title__text:nth-child(3) span {
    transition: transform 1.5s 0.4s $ease-out-expo;
  }

  .about__header__title__text:nth-child(4) span {
    transition: transform 1.5s 0.6s $ease-out-expo;
  }
}

.about__header__title__role {
  span {
    display: block;
  }

  span:last-child {
    text-align: right;
  }
}
</style>
