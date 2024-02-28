<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { RouterLink } from 'vue-router';

import { random } from '../utils/math';

const onEasterEgg = () => {
  const value = random(0, 360, 0.01);
  const background = `hsl(${value}deg 19% 9%)`;

  document.documentElement.style.background = background;
};
</script>

<template>
  <nav class="navigation">
    <ul class="navigation__list">
      <li class="navigation__item">
        <RouterLink to="/" class="navigation__link">BIZAR-RØ</RouterLink>
      </li>
      <li class="navigation__item">
        <RouterLink
          to="/"
          class="navigation__link"
          active-class="navigation__link--active "
          >Work</RouterLink
        >
      </li>
      <li class="navigation__item">
        <RouterLink
          to="/about"
          class="navigation__link"
          active-class="navigation__link--active "
          >About</RouterLink
        >
      </li>
      <li class="navigation__item">
        <a
          href="https://twitter.com/bizar_ro"
          target="_blank"
          class="navigation__link"
          >Reach Out</a
        >
      </li>
      <button class="navigation__easter" @click="onEasterEgg">
        Activate Easter Egg
      </button>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.navigation {
  @extend %cover;

  pointer-events: none;
  position: fixed;
  z-index: z('navigation');
}

.navigation__list {
  @extend %cover;
}

.navigation__item {
  font-size: 2rem;
  line-height: 3.6rem;
  pointer-events: auto;
  position: absolute;

  &:nth-child(1) {
    font: 3rem $font-ampersand;
    left: 5rem;
    top: 5rem;
  }

  &:nth-child(2) {
    right: 20rem;
    top: 5rem;
  }

  &:nth-child(3) {
    right: 5rem;
    top: 5rem;
  }

  &:nth-child(4) {
    bottom: 5rem;
    left: 5rem;
  }

  @include media('<=phone') {
    font-size: 1.6rem;
    line-height: 3.3rem;

    &:nth-child(1) {
      font-size: 2.5rem;
      left: 1.5rem;
      top: 1rem;
    }

    &:nth-child(2) {
      right: 8rem;
      top: 0.5rem;
    }

    &:nth-child(3) {
      right: 1.5rem;
      top: 0.5rem;
    }

    &:nth-child(4) {
      bottom: 1rem;
      left: 1.5rem;
    }
  }
}

.navigation__link--active {
  &:after {
    transform: scaleX(1) !important;
    transform-origin: left center !important;
  }
}

.navigation__link {
  display: inline-block;
  line-height: 1.1;
  vertical-align: middle !important;

  .navigation__item:not(:first-child) & {
    @extend %link--hidden;
  }
}

.navigation__easter {
  background: $color-iron;
  border-radius: 50%;
  bottom: 5rem;
  cursor: pointer;
  font-size: 0;
  height: 2rem;
  position: absolute;
  right: 5rem;
  transition: transform 0.4s $ease-out-expo;
  width: 2rem;

  &:hover {
    transform: scale(1.2);
  }

  @include media('<=phone') {
    right: 1.5rem;
    bottom: 1.5rem;
  }
}
</style>
