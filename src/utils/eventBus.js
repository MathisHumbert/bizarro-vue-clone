import mitt from 'mitt';

const emitter = mitt();

window.addEventListener('resize', () => emitter.emit('resize'));

window.addEventListener('wheel', (e) => emitter.emit('wheel', e));

export default emitter;
