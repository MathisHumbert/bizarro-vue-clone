<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import imagesLoaded from 'imagesloaded';

import Canvas from '../three';
import emitter from '../utils/eventBus';
import { usePageStore } from '../stores/page';

const canvasElement = ref(null);
const canvas = ref(null);

const { textures } = defineProps(['textures']);
const pageStore = usePageStore();

const route = useRoute();

onMounted(() => {
  canvas.value = new Canvas({
    template: route.path,
    element: canvasElement.value,
    textures,
  });

  emitter.on('resize', () => {
    canvas.value.onResize();
  });

  emitter.on('tick', () => {
    canvas.value.tick(pageStore.scroll.current, pageStore.scroll.direction);
  });
});

watch(route, () => {
  const imagesLoader = imagesLoaded(document.querySelectorAll('img'), {
    background: true,
  });

  imagesLoader.on('done', () => {
    if (canvas.value) {
      canvas.value.onPageChange(route.path);
    }
  });
});
</script>

<template>
  <canvas ref="canvasElement"></canvas>
</template>

<style scoped></style>
