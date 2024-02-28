import * as THREE from 'three';

import Home from './Home';

export default class Canvas {
  constructor({ element }) {
    this.canvasElement = element;
    // this.textures = textures;

    this.page = null;
    this.clock = new THREE.Clock();
    this.scroll = 0;

    this.createScene();
    this.createCamera();
    this.createRender();
    this.createGeometry();

    this.onResize();
    this.update();

    this.createHome();
  }

  /**
   * THREE.
   */
  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 5;
  }

  createRender() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: this.canvasElement,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 16, 16);
  }

  /**
   * Home.
   */
  createHome() {
    this.home = new Home({
      scene: this.scene,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
    });
  }

  /**
   * Events.
   */
  onPageChange(template) {
    if (this.page === '/' && template !== '/') {
      this.home.hide();
    }

    if (this.page !== '/' && template === '/') {
      this.home.show();
    }

    this.page = template;
  }

  onResize() {
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.updateProjectionMatrix();

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = { width, height };

    if (this.home && this.home.onResize) {
      this.home.onResize({ screen: this.screen, viewport: this.viewport });
    }
  }

  /**
   * Loop.
   */
  update() {
    const elapsedTime = this.clock.getElapsedTime();

    if (this.home && this.home.update) {
      this.home.update({
        scroll: this.scroll,
        direction: this.direction,
        time: elapsedTime,
      });
    }

    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.update.bind(this));
  }

  tick(scroll, direction) {
    this.scroll = scroll;
    this.direction = direction;
  }
}
