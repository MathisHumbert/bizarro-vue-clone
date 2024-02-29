<script setup>
import { ref } from 'vue';

const totalMedias = ref(new Array(24));
</script>

<template>
  <div class="about__gallery">
    <div
      v-for="(media, index) in totalMedias"
      :key="index"
      class="about__gallery__media"
      :class="
        [1, 2, 8, 9, 11, 12, 13, 15, 16, 19, 21, 23].indexOf(index) > -1
          ? 'about__gallery__media--transparent'
          : ''
      "
    ></div>
    <a
      href="https://www.nationalgallery.org.uk/paintings/ignace-henri-theodore-fantin-latour-a-basket-of-roses"
      target="_blank"
      class="about__gallery__text"
    >
      <strong>A Basket of Roses</strong>
      Ignace-Henri-Théodore Fantin-Latour
    </a>
    <img class="about__gallery__image" src="/about.webp" />
  </div>
</template>

<style scoped lang="scss">
.about__gallery {
  color: $color-pine-tree;
  font-size: 0;
  opacity: 0;
  margin-bottom: 20rem;
  position: relative;
  transition: opacity 0.4s ease;

  .about--active & {
    opacity: 1;
  }

  &:before {
    border: 0.5rem solid currentColor;
    bottom: 0;
    content: '';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }

  @include media('<=phone') {
    margin-bottom: 10rem;
  }
}

.about__gallery__image {
  @extend %cover;

  object-position: bottom;
  opacity: 1;
  transition: opacity 0.4s ease;

  .about__gallery--active & {
    opacity: 1;
  }
}

.about__gallery__media {
  display: inline-block;
  position: relative;
  width: calc(100 / 6 * 1%);
  z-index: 1;

  &:after {
    content: '';
    display: block;
    padding-top: 100%;
  }

  &:before {
    background: currentColor;
    bottom: -0.5rem;
    content: '';
    left: -0.5rem;
    position: absolute;
    right: -0.5rem;
    top: -0.5rem;
  }

  &--transparent {
    &:before {
      background: none;
      border: 1.5rem solid currentColor;
      bottom: -0.5rem;
      content: '';
      left: -0.5rem;
      position: absolute;
      right: -0.5rem;
      top: -0.5rem;
    }
  }

  @include media('<=phone') {
    &:before {
      bottom: -0.4rem;
      content: '';
      left: -0.4rem;
      position: absolute;
      right: -0.4rem;
      top: -0.4rem;
    }

    &--transparent {
      &:before {
        border-width: 0.7rem;
      }
    }
  }
}

.about__gallery__text {
  @extend %link;

  bottom: 1rem;
  color: $color-iron;
  font-size: 1.6rem;
  line-height: 1.1;
  position: absolute;
  left: 0;
  z-index: 3;

  strong {
    display: block;
    font-weight: bold;
  }

  @include media('<=phone') {
    bottom: auto;
    font-size: 1rem;
    margin-top: 0.2rem;
    top: 100%;
  }
}
</style>
