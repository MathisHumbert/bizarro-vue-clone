<script setup>
import { ref, onMounted } from 'vue';
import NormalizeWheel from 'normalize-wheel';
import Prefix from 'prefix';
import gsap from 'gsap';

import AboutHeader from '../components/AboutHeader.vue';
import AboutGallery from '../components/AboutGallery.vue';
import AboutSections from '../components/AboutSections.vue';
import emitter from '../utils/eventBus';
import { lerp, clamp } from '../utils/math';

const element = ref(false);
const wrapperElement = ref(null);
const scroll = ref({ current: 0, target: 0, limit: 0 });

const transformPrefix = Prefix('transform');

onMounted(() => {
  gsap.delayedCall(0.1, () => element.value.classList.add('about--active'));
  scroll.value.limit = wrapperElement.value.clientHeight - window.innerHeight;

  emitter.on('resize', () => {
    scroll.value.limit = wrapperElement.value.clientHeight - window.innerHeight;
  });

  emitter.on('wheel', (e) => {
    const normalized = NormalizeWheel(e);

    scroll.value.target += normalized.pixelY;
  });

  emitter.on('tick', () => {
    scroll.value.target = clamp(0, scroll.value.limit, scroll.value.target);

    scroll.value.current = lerp(scroll.value.current, scroll.value.target, 0.1);

    if (scroll.value.target === 0) {
      scroll.value.current = Math.floor(scroll.value.current);
    } else {
      scroll.value.current = Math.ceil(scroll.value.current);
    }

    if (scroll.value.current < 0.1) {
      scroll.value.current = 0;
    }

    if (element.value) {
      wrapperElement.value.style[
        transformPrefix
      ] = `translate3d(0, ${Math.floor(-scroll.value.current)}px, 0)`;
    }
  });
});
</script>

<template>
  <div class="about" ref="element">
    <div class="about__wrapper" id="wrapper" ref="wrapperElement">
      <AboutHeader />
      <AboutGallery />
      <AboutSections />
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
