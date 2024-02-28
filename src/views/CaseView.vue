<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import NormalizeWheel from 'normalize-wheel';
import Prefix from 'prefix';

import CaseHeader from '../components/CaseHeader.vue';
import CaseInformation from '../components/CaseInformation.vue';
import CaseGallery from '../components/CaseGallery.vue';

import cases from '../data/cases.json';
import emitter from '../utils/eventBus';
import { lerp, clamp } from '../utils/math';

const route = useRoute();
const { id } = route.params;

const project = ref(cases.find((c) => c.id === id));
const element = ref(false);
const wrapperElement = ref(false);
const scroll = ref({ current: 0, target: 0, limit: 0 });

const transformPrefix = Prefix('transform');

onMounted(() => {
  element.value.classList.add('case--active');
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
      element.value.style[transformPrefix] = `translate3d(0, ${Math.floor(
        -scroll.value.current
      )}px, 0)`;
    }
  });
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
}
</style>
