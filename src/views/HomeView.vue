<script setup>
import { ref, onMounted } from 'vue';
import NormalizeWheel from 'normalize-wheel';

import HomeItem from '../components/HomeItem.vue';
import data from '../data/home.json';
import emitter from '../utils/eventBus';
import { lerp } from '../utils/math';

const list = ref(data);
const scroll = ref({ current: 0, target: 0, last: 0, direction: 'up' });
const listElement = ref(null);
const containerHeight = ref(0);

onMounted(() => {
  containerHeight.value = listElement.value.clientHeight;

  emitter.on('resize', () => {
    containerHeight.value = listElement.value.clientHeight;
    scroll.value = { current: 0, target: 0, last: 0 };
  });

  emitter.on('wheel', (e) => {
    const normalized = NormalizeWheel(e);

    scroll.value.target += normalized.pixelY * 0.5;
  });

  emitter.on('tick', () => {
    scroll.value.current = lerp(scroll.value.current, scroll.value.target, 0.1);

    if (scroll.value.current > scroll.value.last) {
      scroll.value.direction = 'up';
    } else if (scroll.value.current < scroll.value.last) {
      scroll.value.direction = 'down';
    }

    scroll.value.last = scroll.value.current;
  });
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

  &:after {
    content: '';
    display: inline-block;
    padding-top: calc(768 / 1366 * 100%);
    width: 100%;
  }
}

.home__case__media {
  @extend %cover;
}
</style>
