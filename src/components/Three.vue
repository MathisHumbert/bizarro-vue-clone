<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import imagesLoaded from 'imagesloaded';

import Canvas from '../three';
import emitter from '../utils/eventBus';

const canvasElement = ref(null);
const canvas = ref(null);

const { textures } = defineProps(['textures']);

const route = useRoute();

onMounted(() => {
  canvas.value = new Canvas({
    template: route.path,
    element: canvasElement.value,
    emitter,
    textures,
  });

  emitter.on('resize', () => {
    canvas.value.onResize();
  });

  emitter.on('wheel', (e) => {
    canvas.value.onWheel(e);
  });

  emitter.on('hideCanvas', (path) => {
    if (path.includes('case')) {
      canvas.value.case.hide();
    }
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
