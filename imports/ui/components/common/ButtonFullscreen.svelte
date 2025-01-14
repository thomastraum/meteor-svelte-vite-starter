<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import Maximize from "lucide-svelte/icons/maximize";
  import Minimize from "lucide-svelte/icons/minimize";
  let { isFullscreen, onclick } = $props();
</script>

<Button {onclick} aria-label={isFullscreen ? "Minimize" : "Maximize"}>
  {#if isFullscreen}
    <Minimize class="h-6 w-6" />
  {:else}
    <Maximize class="h-6 w-6" />
  {/if}
</Button>
