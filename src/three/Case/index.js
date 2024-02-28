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

  createMedia() {
    const element = document.querySelector('.case__media__image');

    this.media = new Media({
      element,
      scene: this.scene,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
    });
  }

  /**
   * Animations.
   */
  show() {
    this.createMedia();

    this.scene.add(this.group);

    if (this.media && this.media.show) {
      this.media.show();
    }
  }

  hide() {
    if (this.media && this.media.hide) {
      this.media.hide();
    }

    this.scene.remove(this.group);
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    if (this.media && this.media.onResize) {
      this.media.onResize({
        screen,
        viewport,
      });
    }
  }

  /**
   * Loop.
   */
  update({ scroll }) {
    if (this.media && this.media.onResize) {
      this.media.update({
        scroll,
      });
    }
  }
}
