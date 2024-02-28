import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', {
  state: () => ({
    scroll: {
      position: 0,
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
      direction: 'up',
    },
  }),
  actions: {
    setScroll(scroll) {
      this.scroll = scroll;
    },
  },
});
