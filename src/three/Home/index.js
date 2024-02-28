import * as THREE from 'three';

import Media from './Media';
export default class Home {
  constructor({ scene, geometry, screen, viewport }) {
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;

    this.group = new THREE.Group();
  }

  createGallery() {
    const mediaElements = document.querySelectorAll('.home__item');
    const caseMedia = document.querySelector('.home__case__media');
    this.containerElement = document.querySelector('.home__list');

    this.medias = [...mediaElements].map((element) => {
      const homeLink = element.querySelector('.home__link');
      const homeMedia = element.querySelector('.home__link__media');

      return new Media({
        homeItem: element,
        homeLink,
        homeMedia,
        caseMedia,
        scene: this.group,
        geometry: this.geometry,
        screen: this.screen,
        viewport: this.viewport,
        containerHeight: this.containerElement.clientHeight,
      });
    });
  }

  /**
   * Animations.
   */
  show() {
    this.createGallery();

    this.scene.add(this.group);

    this.medias.forEach((media) => {
      if (media && media.show) {
        media.show();
      }
    });
  }

  hide() {
    this.medias.forEach((media) => {
      if (media && media.hide) {
        media.hide();
      }
    });

    this.scene.remove(this.group);
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    if (this.medias) {
      const containerHeight = this.containerElement.clientHeight;

      this.medias.forEach((media) => {
        if (media && media.onResize) {
          media.onResize({
            screen,
            viewport,
            containerHeight,
          });
        }
      });
    }
  }

  /**
   * Loop.
   */
  update({ scroll, direction, time }) {
    if (this.medias) {
      this.medias.forEach((media) => {
        if (media && media.update) {
          media.update({ scroll, direction, time });
        }
      });
    }
  }
}
