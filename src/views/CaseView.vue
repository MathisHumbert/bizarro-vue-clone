<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Prefix from 'prefix';
import gsap from 'gsap';

import CaseHeader from '../components/CaseHeader.vue';
import CaseInformation from '../components/CaseInformation.vue';
import CaseGallery from '../components/CaseGallery.vue';

import cases from '../data/cases.json';
import emitter from '../utils/eventBus';

const route = useRoute();
const { id } = route.params;

const project = ref(cases.find((c) => c.id === id));
const element = ref(null);
const wrapperElement = ref(null);
const scroll = ref({ current: 0, target: 0, limit: 0 });

const transformPrefix = Prefix('transform');

onMounted(() => {
  gsap.fromTo(element.value, { autoAlpha: 0 }, { autoAlpha: 1 });
  element.value.classList.add('case--active');

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
  <div class="case" ref="element">
    <div class="case__wrapper" id="wrapper" ref="wrapperElement">
      <CaseHeader :id="project.id" :title="project.title" />
      <CaseInformation
        :company="project.company"
        :role="project.role"
        :technologies="project.technologies"
        :link="project.link"
        :label="project.label"
      />
      <CaseGallery :id="project.id" :gallery="project.gallery" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.case {
  @extend %page;
}

.case__wrapper {
  @extend %page__wrapper;

  padding: 15rem 0;

  @include media('<=phone') {
    padding: 5rem 0;
  }
}
</style>
