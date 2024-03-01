import * as THREE from 'three';
import normalizeWheel from 'normalize-wheel';

import Home from './Home';
import Case from './Case';
import { clamp, lerp } from '../utils/math';

export default class Canvas {
  constructor({ element, emitter }) {
    this.canvasElement = element;
    this.emitter = emitter;

    this.page = '';
    this.clock = new THREE.Clock();
    this.scroll = {
      current: 0,
      target: 0,
      limit: 0,
      position: 0,
      direction: 'up',
    };
    this.isDown = false;

    this.createScene();
    this.createCamera();
    this.createRender();
    this.createGeometry();

    this.onResize();
    this.update();

    this.createHome();
    this.createCase();
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
   * Case.
   */
  createCase() {
    this.case = new Case({
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

    if (this.page.includes('/case') && !template.includes('/case')) {
      this.case.hide();
    }

    if (!this.page.includes('/case') && template.includes('/case')) {
      this.case.show(this.page === '');
    }

    this.page = template;

    this.wrapperElement = document.getElementById('wrapper');
    this.reset();

    this.onResize();
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

    if (this.wrapperElement) {
      this.scroll.limit = this.wrapperElement.clientHeight - this.screen.height;
    }

    if (this.home && this.home.onResize) {
      this.home.onResize({ screen: this.screen, viewport: this.viewport });
    }

    if (this.case && this.case.onResize) {
      this.case.onResize({ screen: this.screen, viewport: this.viewport });
    }
  }

  onWheel(e) {
    const normalized = normalizeWheel(e);

    if (this.page === '/') {
      this.scroll.target += normalized.pixelY * 0.5;
    } else {
      this.scroll.target += normalized.pixelY;
    }
  }

  onTouchDown(event) {
    if (window.innerWidth > 812) return;

    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchMove(event) {
    if (window.innerWidth > 812 || !this.isDown) return;

    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = (this.start - y) * (this.page === '/' ? 2 : 3);

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    if (window.innerWidth > 812) return;

    this.isDown = false;
  }

  reset() {
    this.scroll = {
      current: 0,
      target: 0,
      limit: 0,
      direction: 'up',
    };
  }

  /**
   * Loop.
   */
  update() {
    const elapsedTime = this.clock.getElapsedTime();

    if (this.page !== '/') {
      this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target);
    }

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, 0.1);

    if (this.page !== '/') {
      if (this.scroll.target === 0) {
        this.scroll.current = Math.floor(this.scroll.current);
      } else {
        this.scroll.current = Math.ceil(this.scroll.current);
      }

      if (this.scroll.current < 0.1) {
        this.scroll.current = 0;
      }
    }

    if (this.scroll.current > this.scroll.last) {
      this.scroll.direction = 'up';
    } else if (this.scroll.current < this.scroll.last) {
      this.scroll.direction = 'down';
    }

    this.emitter.emit('tick', this.scroll);

    if (this.home && this.home.update) {
      this.home.update({
        scroll: this.scroll.current,
        direction: this.scroll.direction,
        time: elapsedTime,
      });
    }

    if (this.case && this.case.update) {
      this.case.update({
        scroll: this.scroll.current,
      });
    }

    this.scroll.last = this.scroll.current;

    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.update.bind(this));
  }
}
