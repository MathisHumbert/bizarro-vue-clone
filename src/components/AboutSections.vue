<script setup>
import { ref, onMounted } from 'vue';
import SplitType from 'split-type';

import award from '../data/award.json';
import press from '../data/press.json';
import { getOffset } from '../utils/dom';
import emitter from '../utils/eventBus';
import { clamp } from '../utils/math';

const props = defineProps(['scroll']);

const awards = ref(award);
const presss = ref(press);
const paragraphAnimation = ref(null);
const awardListAnimation = ref(null);
const pressListAnimation = ref(null);
const reachParagraphAnimation = ref(null);
const aboutTitle = ref(null);
const awardsTitle = ref(null);
const pressTitle = ref(null);

onMounted(() => {
  [...paragraphAnimation.value.children, reachParagraphAnimation.value].forEach(
    (element) => {
      let isVisible = false;

      const firstLine = new SplitType(element, {
        types: 'lines',
        tagName: 'span',
      }).lines;

      const secondLine = firstLine.map((el) => {
        const line = new SplitType(el, {
          types: 'lines',
          tagName: 'span',
        });

        return line.lines;
      });

      firstLine.forEach((line) => (line.style.overflow = 'hidden'));

      secondLine.forEach(
        (line) => (line[0].style.transform = 'translateY(100%)')
      );

      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!isVisible && entry.isIntersecting) {
            isVisible = true;

            secondLine.forEach((line, lineIndex) => {
              line[0].style.transition = `transform 1.5s ${
                lineIndex * 0.1
              }s cubic-bezier(0.19, 1, 0.22, 1)`;
              line[0].style.transform = 'translateY(0)';
            });
          }
        });
      }).observe(element);
    }
  );

  [
    ...awardListAnimation.value.children,
    ...pressListAnimation.value.children,
  ].forEach((element) => {
    let isVisible = false;

    const line = element.children[0];
    const link = element.children[1];

    link.style.transform = 'translateY(100%)';

    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!isVisible && entry.isIntersecting) {
          isVisible = true;

          line.style.transform = 'scaleX(1)';
          link.style.transition = `transform 1.5s cubic-bezier(0.19, 1, 0.22, 1)`;
          link.style.transform = 'translateY(0)';
        }
      });
    }).observe(element);
  });

  [aboutTitle.value, awardsTitle.value, pressTitle.value].forEach((element) => {
    if (window.innerWidth > 812) {
      const bounding = getOffset(element);
      element.start = bounding.top;
      element.limit = getOffset(element.parentNode).height - bounding.height;
    } else {
      element.style.transform = '';
    }
  });

  emitter.on('resize', () => {
    [aboutTitle.value, awardsTitle.value, pressTitle.value].forEach(
      (element) => {
        if (window.innerWidth > 812) {
          const bounding = getOffset(element, props.scroll.current);
          element.start = bounding.top;
          element.limit =
            getOffset(element.parentNode).height - bounding.height;
        } else {
          element.style.transform = '';
        }
      }
    );
  });

  emitter.on('tick', () => {
    if (window.innerWidth > 812) {
      [aboutTitle.value, awardsTitle.value, pressTitle.value].forEach(
        (element) => {
          const y = clamp(
            0,
            element.limit,
            Math.floor(props.scroll.current - element.start)
          );

          element.style.transform = `translateY(${y}px)`;
        }
      );
    }
  });
});
</script>

<template>
  <div class="about__sections">
    <div class="about__section">
      <h2 class="about__section__title" ref="aboutTitle">About</h2>
      <div class="about__section__content" ref="paragraphAnimation">
        <p class="about__section__description">
          I’m Luis Henrique Bizarro, I’m a Creative Developer based in São
          Paulo, Brazil specialized in Creative Coding for interactive projects
          like apps, games, installations and websites using web development
          technologies like WebGL, GLSL and JavaScript.
        </p>
        <p class="about__section__description">
          I’m working at Apple as a Senior Creative Technologist. I’m the
          <a href="https://www.awwwards.com/winner-list/Brazil" target="_blank"
            >Most Awarded Developer in Brazil</a
          >
          at
          <a href="https://awwwards.com/" target="_blank">Awwwards</a>
          and member of the
          <a href="https://www.awwwards.com/jury-member/bizarro" target="_blank"
            >Development Jury</a
          >
          In the past I’ve also collaborated with
          <a href="https://activetheory.net/" target="_blank">Active Theory</a>,
          <a href="https://antinomy.eu/" target="_blank">Antinomy</a> and
          <a href="https://unit9.com/" target="_blank">UNIT9</a>.
        </p>
        <p class="about__section__description">
          During my career, I have had the opportunity to collaborate in
          challenging projects for renown international brands such as Xbox,
          Nike, Google, Microsoft, Airbnb, Samsung, Lufthansa, Ambush, Shell,
          Chevy Corvette, HBO, Cartoon Network, Discovery Kids, One Plus, GE and
          Citibank.
        </p>
      </div>
    </div>
    <div class="about__section">
      <h2 class="about__section__title" ref="awardsTitle">
        Awards <br />
        & Honors
      </h2>
      <div class="about__section__content">
        <p class="about__section__number">110+</p>
        <ul class="about__section__list" ref="awardListAnimation">
          <li
            v-for="award in awards"
            :key="award.link"
            class="about__section__list__item"
          >
            <span class="about__section__list__dash"></span>
            <a
              :href="award.link"
              target="_blank"
              class="about__section__list__link"
            >
              <span class="about__section__list__column">{{ award.date }}</span>
              <span class="about__section__list__column">{{
                award.title
              }}</span>
              <span class="about__section__list__column">{{
                award.description
              }}</span>
              <span class="about__section__list__column">{{
                award.project
              }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="about__section">
      <h2 class="about__section__title" ref="pressTitle">PRESS</h2>
      <div class="about__section__content">
        <p class="about__section__number">10+</p>
        <ul class="about__section__list" ref="pressListAnimation">
          <li
            v-for="article in presss"
            :key="article.link"
            class="about__section__list__item"
          >
            <span class="about__section__list__dash"></span>
            <a
              :href="article.link"
              class="about__section__list__link about__section__list__link--article"
            >
              <span class="about__section__list__column">{{
                article.title
              }}</span>
              <span class="about__section__list__column">{{
                article.description
              }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="about__section">
      <h2 class="about__section__title"></h2>
      <div class="about__section__content">
        <p class="about__section__description" ref="reachParagraphAnimation">
          You can reach me out at the email
          <a href="mailto:luis@bizar.ro">luis@bizar.ro</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about__section {
  display: flex;
  position: relative;

  &:not(:first-child) {
    margin-top: 10rem;
  }

  @include media('<=phone') {
    display: block;

    &:not(:first-child) {
      margin-top: 7.5rem;
    }
  }
}

.about__section__title {
  font: 10rem/0.95 $font-ampersand;
  margin-bottom: auto;
  padding-top: 10.5rem;
  position: relative;
  width: 33.33%;

  @include media('<=phone') {
    font-size: 4rem;
    padding-top: 0;
    width: 100%;
  }
}

.about__section__content {
  padding-top: 10rem;
  width: 66.66%;

  @include media('<=phone') {
    padding-top: 2rem;
    width: 100%;
  }
}

.about__section__description {
  font-size: 3.5rem;
  line-height: 1.5;
  width: 79%;

  a {
    @extend %link;
  }

  &:not(:first-child) {
    margin-top: 5rem;
  }

  @include media('<=phone') {
    font-size: 1.6rem;
    padding-left: 16.66667%;
    width: 100%;

    &:not(:first-child) {
      margin-top: 2rem;
    }
  }
}

.line {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
}

.about__section__description__text {
  padding-left: 0.5rem;
}

.about__section__number {
  font: 50rem/1 $font-ampersand;
  height: 50rem;
  margin-top: -4.3rem;

  @include media('<=phone') {
    font-size: 20rem;
    height: 20rem;
    margin-top: 0;
  }
}

.about__section__list {
  font-size: 2.4rem;
  white-space: nowrap;

  @include media('<=phone') {
    font-size: 1.4rem;
  }
}

.about__section__list__item {
  overflow: hidden;
  position: relative;
}

.about__section__list__dash {
  border-top: 1px solid rgba($color-iron, 0.1);
  left: 0;
  position: absolute;
  top: 0;
  transform: scaleX(0);
  transition: transform 1.5s $ease-out-expo;
  transform-origin: left;
  width: 100%;
}

.about__section__list__link {
  display: flex;
  justify-content: space-between;
  padding: 2rem;
  position: relative;

  &:after {
    background: $color-iron;
    content: '';
    display: block;
    height: 100%;
    left: 0;
    mix-blend-mode: difference;
    position: absolute;
    top: 0;
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.4s $ease-out-expo;
    width: 100%;
  }

  &:hover:after {
    transform: scaleY(1);
    transform-origin: bottom;
  }

  @include media('<=phone') {
    flex-wrap: wrap;
    padding: 1rem 0;
  }
}

.about__section__list__column {
  display: block;
  text-align: left;

  &:nth-child(1) {
    width: 20rem;
  }

  &:nth-child(2) {
    width: 30rem;
  }

  &:nth-child(3) {
    width: 44.5rem;
  }

  &:nth-child(4) {
    width: 35.5rem;
  }

  .about__section__list__link--article & {
    &:nth-child(1) {
      width: 30%;
    }

    &:nth-child(2) {
      width: 70%;
    }
  }

  @include media('<=phone') {
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
      width: 50%;
    }

    .about__section__list__link--article & {
      &:nth-child(2) {
        display: block;
      }
    }
  }
}
</style>
