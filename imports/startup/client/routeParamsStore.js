import { readable } from 'svelte/store';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

export const routeParams = readable({}, set => {
  FlowRouter.watchPathChange();
  set(FlowRouter.current().params);
});