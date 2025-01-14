<script>
  import { onMount } from 'svelte';
  
  let component = $state(null);
  
  // Expose the component state and a setter function
  export function setComponent(newComponent) {
    component = newComponent;
  }
  
  export { component };
</script> 