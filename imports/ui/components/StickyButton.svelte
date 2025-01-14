<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import { Loader } from "lucide-svelte";

  import LoaderCircle from "lucide-svelte/icons/loader-circle";

  let { text, disabled, isLoading } = $props();
</script>

<div class="sticky bottom-[-4px] bg-black border-t">
  <div class="dark:bg-r8-gray-1 py-5 h-32 flex justify-center items-center">
    <Button class="w-full" variant="default" {disabled}>
      {#if isLoading}
        <LoaderCircle class="animate-spin" />
        Running Workflow
      {:else}
        Run Workflow
      {/if}
    </Button>
  </div>
</div>
