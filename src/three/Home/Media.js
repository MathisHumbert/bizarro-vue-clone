import * as THREE from 'three';
import gsap from 'gsap';

import fragment from '../../shaders/fragment.glsl';
import vertex from '../../shaders/vertex.glsl';
import { lerp } from '../../utils/math';

export default class Media {
  constructor({
    homeLink,
    homeMedia,
    scene,
    geometry,
    screen,
    viewport,
    containerHeight,
  }) {
    this.homeLink = homeLink;
    this.homeMedia = homeMedia;
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;
    this.containerHeight = (viewport.height * containerHeight) / screen.height;

    this.direction = homeMedia.dataset.direction;
    this.isVisible = false;
    this.isHover = false;
    this.isOpen = false;
    this.scroll = 0;
    this.extra = 0;
    this.textureLoader = new THREE.TextureLoader();
    this.alpha = {
      current: 0,
      target: 0,
      ease: 0.15,
    };

    this.createTexture();
    this.createMaterial();
    this.createMesh();

    this.addEventListeners();
    this.onResize({ viewport, screen, containerHeight });
  }

  /**
   * Create.
   */
  createTexture() {
    this.textureLoader.load(this.homeMedia.src, (texture) => {
      this.material.uniforms.uTexture.value = texture;
    });
  }

  createMaterial() {
    this.material = new THREE.RawShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      transparent: true,
      uniforms: {
        uTexture: { value: null },
        uTime: { value: 0 },
        uAlpha: { value: 0 },
        uDirection: { value: this.direction === 'left' ? 0.5 : -0.5 },
        uMultiplier: { value: 1 },
      },
    });
  }

  createMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  createBounds() {
    const rect = this.homeMedia.getBoundingClientRect();

    this.bounds = {
      top: rect.top + this.scroll,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    this.updateScale();
    this.updateX();
    this.updateY(this.scroll);
  }

  /**
   * Update.
   */
  updateScale() {
    this.mesh.scale.x =
      (this.viewport.width * this.bounds.width) / this.screen.width;
    this.mesh.scale.y =
      (this.viewport.height * this.bounds.height) / this.screen.height;
  }

  updateX(x = 0) {
    this.mesh.position.x =
      -this.viewport.width / 2 +
      this.mesh.scale.x / 2 +
      ((this.bounds.left - x) / this.screen.width) * this.viewport.width;
  }

  updateY(y = 0) {
    this.mesh.position.y =
      this.viewport.height / 2 -
      this.mesh.scale.y / 2 -
      ((this.bounds.top - y) / this.screen.height) * this.viewport.height -
      this.extra;
  }

  updateAlpha() {
    if (this.isHover || this.isOpen) {
      this.alpha.target = 1;
    } else {
      this.alpha.target = 0;
    }

    if (this.alpha.current === this.alpha.target) return;

    this.alpha.current = lerp(
      this.alpha.current,
      this.alpha.target,
      this.alpha.ease
    );

    if (this.alpha.current < 0.01) {
      this.alpha.current = 0;
    } else if (this.alpha.current > 0.99) {
      this.alpha.current = 1;
    }

    this.material.uniforms.uAlpha.value = this.alpha.current;
  }

  /**
   * Animations.
   */
  show() {
    this.isVisible = true;
  }

  hide() {
    this.scene.remove(this.mesh);
    this.isVisible = false;
  }

  /**
   * Events.
   */
  onResize({ screen, viewport, containerHeight }) {
    this.screen = screen;
    this.viewport = viewport;
    this.containerHeight = (viewport.height * containerHeight) / screen.height;

    this.extra = 0;

    this.createBounds();
  }

  onMouseEnter() {
    this.isHover = true;
  }

  onMouseLeave() {
    this.isHover = false;
  }

  /**
   * Loop.
   */
  update({ scroll, direction, time }) {
    if (!this.isVisible) return;

    if (this.alpha.current > 0) {
      this.material.uniforms.uTime.value =
        this.direction === 'left' ? time : -time;
    }

    this.updateY(scroll);
    this.updateAlpha();

    const planeOffset = this.mesh.scale.y / 2;
    const viewportOffset = this.viewport.height / 2;

    this.isBefore = this.mesh.position.y + planeOffset < -viewportOffset;
    this.isAfter = this.mesh.position.y - planeOffset > viewportOffset;

    if (direction === 'down' && this.isBefore) {
      this.extra -= this.containerHeight;

      this.isBefore = false;
      this.isAfter = false;
    }
    if (direction === 'up' && this.isAfter) {
      this.extra += this.containerHeight;

      this.isBefore = false;
      this.isAfter = false;
    }

    this.scroll = scroll;
  }

  /**
   * EventListeners.
   */
  addEventListeners() {
    this.homeLink.addEventListener('mouseenter', this.onMouseEnter.bind(this));

    this.homeLink.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }
}
