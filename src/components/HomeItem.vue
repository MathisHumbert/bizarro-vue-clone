<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Prefix from 'prefix';
import gsap from 'gsap';

import { getOffset } from '../utils/dom';
import emitter from '../utils/eventBus';
import { delay } from '../utils/math';

const isBefore = ref(false);
const isAfter = ref(false);
const extra = ref(0);
const offset = ref(null);
const element = ref(null);

const props = defineProps([
  'id',
  'title',
  'direction',
  'containerHeight',
  'scroll',
]);
const router = useRouter();

const transformPrefix = Prefix('transform');

const onLinkClick = async (e) => {
  e.preventDefault();

  gsap.to('.home', { autoAlpha: 0, duration: 0.4 });

  await delay(2000);

  const url = e.target.href.replace(window.location.origin, '');

  router.push(url);
};

onMounted(() => {
  offset.value = getOffset(element.value);

  emitter.on('resize', () => {
    offset.value = getOffset(element.value);
    extra.value = 0;
  });

  emitter.on('tick', () => {
    const { containerHeight, scroll } = props;

    const position = -scroll.current - extra.value;
    const offsetPostion = position + offset.value.top + offset.value.height;

    isBefore.value = offsetPostion < 0;
    isAfter.value = offsetPostion + offsetPostion * 0.1 > containerHeight;

    if (scroll.direction === 'up' && isBefore.value) {
      extra.value -= containerHeight;

      isBefore.value = false;
      isAfter.value = false;
    }

    if (scroll.direction === 'down' && isAfter.value) {
      extra.value += containerHeight;

      isBefore.value = false;
      isAfter.value = false;
    }

    if (element.value) {
      element.value.style[transformPrefix] = `translate3d(0, ${Math.floor(
        position
      )}px, 0)`;
    }
  });
});

onUnmounted(() => {
  emitter.off('reisze');
  emitter.off('tick');
});
</script>

<template>
  <li
    :class="`home__item home__item--${props.id}`"
    :data-id="props.id"
    ref="element"
  >
    <a :href="`/case/${props.id}`" @click="onLinkClick" class="home__link">
      <span class="home__link__wrapper">
        {{ props.title }}
        <img
          :src="`/projects/${props.id}.webp`"
          :alt="props.id"
          :data-direction="props.direction"
          class="home__link__media"
        /> </span
    ></a>
  </li>
</template>

<style scoped lang="scss">
.home__item {
  font: 15rem/0.9 $font-ampersand;
  white-space: nowrap;

  @include media('<=phone') {
    font-size: 4rem;
  }
}

.home__link {
  display: block;
  text-align: center;
}

.home__link__wrapper {
  display: inline-block;
  pointer-events: none;
  position: relative;

  .home__item--xbox-museum & {
    transform: translateX(-4.4rem);
  }

  .home__item--bbdo & {
    transform: translateX(-0.7rem);
  }

  .home__item--peggy-gou & {
    transform: translateX(32.3rem);
  }

  .home__item--isabel-moranta & {
    transform: translateX(-2rem);
  }

  .home__item--floema & {
    transform: translateX(-0.6rem);
  }

  .home__item--garoa-skincare & {
    transform: translateX(-13.2rem);
  }

  .home__item--design-embraced & {
    transform: translateX(-11.3rem);
  }

  .home__item--kacper-chlebowicz & {
    transform: translateX(4.7rem);
  }

  .home__item--trolli & {
    transform: translateX(-24.3rem);
  }

  .home__item--adventure-time & {
    transform: translateX(7.5rem);
  }

  .home__item--studio-maertens & {
    transform: translateX(24.5rem);
  }

  .home__item--inbound & {
    transform: translateX(28.6rem);
  }

  .home__item--redis & {
    transform: translateX(-9rem);
  }

  .home__item--kaleidoz & {
    transform: translateX(-4.7rem);
  }

  .home__item--erika-moreira & {
    transform: translateX(-32.5rem);
  }

  .home__item--bruno-arizio & {
    transform: translateX(37.4rem);
  }

  .home__item--dominic-berzins & {
    transform: translateX(12.8rem);
  }

  .home__item--pagethink & {
    transform: translateX(-1.8rem);
  }

  .home__item--cult & {
    transform: translateX(-13.5rem);
  }

  .home__item--movida & {
    transform: translateX(-7.6rem);
  }

  .home__item--lufthansa-2 & {
    transform: translateX(9.8rem);
  }

  .home__item--tiaa & {
    transform: translateX(5.9rem);
  }

  .home__item--lufthansa-1 & {
    transform: translateX(40rem);
  }

  .home__item--shell & {
    transform: translateX(-14.3rem);
  }

  .home__item--corvette & {
    transform: translateX(-24.5rem);
  }

  .home__item--nike & {
    transform: translateX(3.7rem);
  }

  .home__item--airbnb & {
    transform: translateX(-18rem);
  }

  .home__item--discovery-kids & {
    transform: translateX(-36.8rem);
  }

  .home__item--rock-in-rio & {
    transform: translateX(-3.1rem);
  }

  .home__item--neoway & {
    transform: translateX(18.4rem);
  }

  .home__item--one-plus & {
    transform: translateX(12.2rem);
  }

  .home__item--samsung & {
    transform: translateX(4.9rem);
  }

  @include media('<=phone') {
    transform: none !important;
    width: 100%;
  }
}

.home__link__media {
  background: $color-iron;
  bottom: 2.2rem;
  height: 10.3rem;
  margin: 0 1rem;
  object-fit: cover;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  transition: width 0.4s 0.4s $ease-out-expo;
  width: 18.3rem;

  &[data-direction='left'] {
    right: 100%;
  }

  &[data-direction='right'] {
    left: 100%;
  }

  @include media('<=phone') {
    bottom: 50%;
    margin: 0;

    &[data-direction='left'] {
      right: 50%;
      transform: translate(50%, 50%);
    }

    &[data-direction='right'] {
      left: 50%;
      transform: translate(-50%, 50%);
    }
  }
}
</style>
