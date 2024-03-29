<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

import HomeItem from '../components/HomeItem.vue';
import data from '../data/home.json';
import emitter from '../utils/eventBus';

const list = ref(data);
const scroll = ref({ current: 0, target: 0, last: 0, direction: 'up' });
const listElement = ref(null);
const containerHeight = ref(0);

onMounted(() => {
  containerHeight.value = listElement.value.clientHeight;

  emitter.on('resize', () => {
    containerHeight.value = listElement.value.clientHeight;
  });

  emitter.on('tick', (canvasScroll) => {
    scroll.value = canvasScroll;
  });
});

onUnmounted(() => {
  emitter.off('resize');
  emitter.off('tick');
});
</script>

<template>
  <div class="home">
    <div class="home__background">
      <div class="home__background__top"></div>
      <div class="home__background__bottom"></div>
    </div>
    <div class="home__wrapper" id="wrapper" ref="wrapperElement">
      <div class="home__case">
        <div class="home__case__media"></div>
      </div>
      <ul class="home__list" ref="listElement">
        <HomeItem
          v-for="item in list"
          :key="item.id"
          :id="item.id"
          :title="item.title"
          :direction="item.direction"
          :containerHeight="containerHeight"
          :scroll="scroll"
        />
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  @extend %page;
}

.home__wrapper {
  @extend %page__wrapper;
}

.home__background {
  @extend %cover;

  color: $color-pine-tree;
  display: none;
  pointer-events: none;
  z-index: 10;

  &__top,
  &__bottom {
    background: currentColor;
    content: '';
    display: block;
    height: 10rem;
    position: absolute;
    width: 100%;
  }

  &__top {
    background: linear-gradient(to bottom, currentColor 0%, transparent 100%);
    top: 0;
  }

  &__bottom {
    background: linear-gradient(to bottom, transparent 0%, currentColor 100%);
    bottom: 0;
  }

  @include media('<=phone') {
    display: block;
  }
}

.home__case {
  position: absolute;
  left: 0;
  top: 27rem;
  width: 100%;

  border: 1px solid red;

  &:after {
    content: '';
    display: inline-block;
    padding-top: calc(768 / 1366 * 100%);
    width: 100%;
  }

  @include media('<=phone') {
    top: 10rem;
  }
}

.home__case__media {
  @extend %cover;
}
</style>
