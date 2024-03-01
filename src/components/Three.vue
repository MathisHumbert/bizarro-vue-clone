<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import imagesLoaded from 'imagesloaded';

import Canvas from '../three';
import emitter from '../utils/eventBus';

const canvasElement = ref(null);
const canvas = ref(null);

const route = useRoute();

onMounted(() => {
  canvas.value = new Canvas({
    element: canvasElement.value,
    emitter,
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

  window.addEventListener('mousedown', (e) => canvas.value.onTouchDown(e));
  window.addEventListener('mousemove', (e) => canvas.value.onTouchMove(e));
  window.addEventListener('mouseup', (e) => canvas.value.onTouchUp(e));

  window.addEventListener('touchstart', (e) => canvas.value.onTouchDown(e));
  window.addEventListener('touchmove', (e) => canvas.value.onTouchMove(e));
  window.addEventListener('touchend', (e) => canvas.value.onTouchUp(e));
});

watch(route, () => {
  canvas.value.reset();

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
