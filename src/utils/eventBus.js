import mitt from 'mitt';

const emitter = mitt();

window.addEventListener('resize', () => emitter.emit('resize'));

window.addEventListener('wheel', (e) => emitter.emit('wheel', e));

const update = () => {
  emitter.emit('tick');

  window.requestAnimationFrame(update);
};

update();

export default emitter;
