<script>
  import Nav from "./components/layout/Nav.svelte";
  import { ModeWatcher } from "mode-watcher";
  import { FlowRouter } from "meteor/ostrio:flow-router-extra";
</script>

<div
  id=""
  class="flex flex-col min-h-screen w-full text-foreground font-medium"
>
  <ModeWatcher />
  <Nav />

  <main class="container flex-grow max-w-screen-2xl">
    <h1>Hello World</h1>
  </main>
</div>

<style>
  :global(html, body) {
    height: 100%;
  }
</style>
