<script>
  import Nav from "./components/layout/Nav.svelte";
  import { ModeWatcher } from "mode-watcher";
  import { component } from "/imports/startup/client/routeManager";
  import { FlowRouter } from "meteor/ostrio:flow-router-extra";

  // Import routes to initialize them
  import "/imports/startup/client/routes";
</script>

<div class="flex flex-col min-h-screen w-full text-foreground font-medium">
  <ModeWatcher />
  <Nav />

  <main class="container flex-grow max-w-screen-2xl">
    {#if component}
      <svelte:component this={component} />
    {:else}
      <p>Loading...</p>
    {/if}
  </main>
</div>

<style>
  :global(html, body) {
    height: 100%;
  }
</style>
