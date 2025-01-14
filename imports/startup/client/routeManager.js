import RouteState from './RouteState.svelte';

// Create an instance of the route state component
const routeState = new RouteState({
  target: document.createElement('div') // Virtual target, won't be mounted
});

export const { component, setComponent } = routeState; 