<script>
  import { Router, Route } from "svelte5-router";
  import Nav from "./components/layout/Nav.svelte";
  import { ModeWatcher } from "mode-watcher";

  // Import pages
  import Home from "/imports/ui/pages/Home.svelte";
  import PostsPage from "/imports/ui/pages/PostsPage.svelte";
  let url = "";
</script>

<div class="flex flex-col min-h-screen w-full text-foreground font-medium">
  <main class="container flex-grow max-w-screen-2xl">
    <Router {url}>
      <ModeWatcher />
      <Nav />
      <Route path="/posts"><PostsPage /></Route>
      <Route path="/"><Home /></Route>
    </Router>
  </main>
</div>

<style>
  :global(html, body) {
    height: 100%;
  }
</style>
