<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Prefix from 'prefix';

import AboutHeader from '../components/AboutHeader.vue';
import AboutGallery from '../components/AboutGallery.vue';
import AboutSections from '../components/AboutSections.vue';
import emitter from '../utils/eventBus';

const element = ref(false);
const wrapperElement = ref(null);
const scroll = ref({ current: 0, target: 0, limit: 0 });

const transformPrefix = Prefix('transform');

onMounted(() => {
  element.value.classList.add('about--active');

  emitter.on('tick', (canvasScroll) => {
    scroll.value = canvasScroll;

    if (element.value) {
      wrapperElement.value.style[
        transformPrefix
      ] = `translate3d(0, ${Math.floor(-scroll.value.current)}px, 0)`;
    }
  });
});

onUnmounted(() => {
  emitter.off('tick');
});
</script>

<template>
  <div class="about" ref="element">
    <div class="about__wrapper" id="wrapper" ref="wrapperElement">
      <AboutHeader />
      <AboutGallery />
      <AboutSections :scroll="scroll" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.about {
  @extend %page;
}

.about__wrapper {
  @extend %page__wrapper;

  padding: 15rem 0;

  margin: auto;
  text-align: left;
  width: 176.7rem;

  @include media('<=phone') {
    width: 95%;
  }
}
</style>
