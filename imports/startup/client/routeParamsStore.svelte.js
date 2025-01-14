import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Create reactive state to hold the current route params
export let routeParams = $state({});

// Watch for route changes and update params
FlowRouter.watchPathChange();
FlowRouter.triggers.enter([() => {
  routeParams = FlowRouter.current().params;
}]); 