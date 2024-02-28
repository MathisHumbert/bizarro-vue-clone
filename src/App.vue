<script setup>
import { RouterView } from 'vue-router';

import Three from './components/Three.vue';
import Nav from './components/Nav.vue';
</script>

<template>
  <Nav />
  <RouterView />
  <Three />
</template>

<style scoped></style>
