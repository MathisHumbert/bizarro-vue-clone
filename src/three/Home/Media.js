import * as THREE from 'three';
import gsap from 'gsap';

import fragment from '../../shaders/fragment.glsl';
import vertex from '../../shaders/vertex.glsl';
import { lerp } from '../../utils/math';

export default class Media {
  constructor({
    homeItem,
    homeLink,
    homeMedia,
    caseMedia,
    scene,
    geometry,
    screen,
    viewport,
    containerHeight,
  }) {
    this.homeItem = homeItem;
    this.homeLink = homeLink;
    this.homeMedia = homeMedia;
    this.caseMedia = caseMedia;
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;
    this.containerHeight = (viewport.height * containerHeight) / screen.height;
    this.id = homeItem.dataset.id;

    this.direction = homeMedia.dataset.direction;
    this.isVisible = false;
    this.isHover = false;
    this.isOpen = false;
    this.scroll = 0;
    this.transition = 0;
    this.textureLoader = new THREE.TextureLoader();
    this.alpha = {
      current: 0,
      target: 0,
      ease: 0.15,
    };

    this.createTexture();
    this.createMaterial();
    this.createMesh();
    this.createTween();

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
    const homeRect = this.homeMedia.getBoundingClientRect();
    const caseRect = this.caseMedia.getBoundingClientRect();

    this.boundsHome = {
      top: homeRect.top + this.scroll,
      left: homeRect.left,
      width: homeRect.width,
      height: homeRect.height,
    };

    this.boundsCase = {
      top: caseRect.top + this.scroll,
      left: caseRect.left,
      width: caseRect.width,
      height: caseRect.height,
    };

    this.updateScale();
    this.updateX();
    this.updateY(this.scroll);
  }

  createTween() {
    this.animation = gsap.timeline({ paused: true });

    this.animation
      .fromTo(
        this,
        { transition: 0 },
        { transition: 1, delay: 0.5, duration: 1.5, ease: 'expo.inOut' },
        0
      )
      .fromTo(
        this.material.uniforms.uMultiplier,
        { value: 1 },
        { value: 0, duration: 1.5, ease: 'power4.in' },
        0
      );
  }

  /**
   * Update.
   */
  updateScale() {
    const width = lerp(
      this.boundsHome.width,
      this.boundsCase.width,
      this.transition
    );
    const height = lerp(
      this.boundsHome.height,
      this.boundsCase.height,
      this.transition
    );

    this.mesh.scale.x = (this.viewport.width * width) / this.screen.width;
    this.mesh.scale.y = (this.viewport.height * height) / this.screen.height;
  }

  updateX() {
    const postionX = lerp(
      this.boundsHome.left,
      this.boundsCase.left,
      this.transition
    );

    this.mesh.position.x =
      -this.viewport.width / 2 +
      this.mesh.scale.x / 2 +
      (postionX / this.screen.width) * this.viewport.width;
  }

  updateY(y = 0) {
    const positionY = lerp(
      ((this.boundsHome.top - y) / this.screen.height) * this.viewport.height -
        this.extra,
      (this.boundsCase.top / this.screen.height) * this.viewport.height,
      this.transition
    );

    this.mesh.position.y =
      this.viewport.height / 2 - this.mesh.scale.y / 2 - positionY;
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

  onOpen() {
    this.isOpen = true;

    this.animation.play();
  }

  onClose() {
    this.isOpen = false;

    this.animation.reverse();
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

    this.updateScale();
    this.updateX();
    this.updateY(scroll);
    this.updateAlpha();

    const planeOffset = this.mesh.scale.y / 2;
    const viewportOffset = this.viewport.height / 2;

    this.isBefore = this.mesh.position.y + planeOffset < -viewportOffset;
    this.isAfter = this.mesh.position.y - planeOffset > viewportOffset;

    if (direction === 'down' && this.isBefore) {
      this.extra += this.containerHeight;

      this.isBefore = false;
      this.isAfter = false;
    }

    if (direction === 'up' && this.isAfter) {
      this.extra -= this.containerHeight;

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
