<script>
  import { ArrowUp, ArrowDown } from "lucide-svelte";
  import { getContext } from "svelte";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import { Label } from "$lib/components/ui/label/index.ts";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Input } from "$lib/components/ui/input";

  let { node, nodeId, onVisibilityChange } = $props();
  let visible = $state(node._meta?.visible ?? false);
  let isEditingName = $state(false);
  let title = $state(node._meta?.title ?? node.class_type ?? "");

  let WorkflowContext = getContext("WorkflowContext");

  $effect(() => {
    visible = node._meta?.visible ?? false;
    title = node._meta?.title ?? node.class_type ?? "";
  });

  function handleTitleChange() {
    WorkflowContext.updateNode(nodeId, {
      ...node,
      _meta: {
        ...node._meta,
        title,
      },
    });
    isEditingName = false;
  }
</script>

<div class="px-6 py-4 flex justify-between items-center border-b">
  <div class="flex items-center gap-2">
    {#if isEditingName}
      <Input
        bind:value={title}
        class="w-[200px]"
        autofocus
        onblur={handleTitleChange}
        onkeydown={(e) => e.key === "Enter" && handleTitleChange()}
      />
    {:else}
      <h2
        class="pr-4 tracking-tight hover:cursor-pointer hover:text-muted-foreground"
        onclick={() => (isEditingName = true)}
      >
        {title}
      </h2>
    {/if}
    {#if node.class_type}
      <div class="text-sm text-white/70">{node.class_type}</div>
    {/if}
  </div>

  {#if getContext("UiState").editing}
    <div class="flex items-center space-x-2">
      <div>
        {#if WorkflowContext.getPosition(nodeId) > 0}
          <Button
            variant="outline"
            size="icon"
            onclick={() => {
              WorkflowContext.moveNode(nodeId, "up");
            }}
          >
            <ArrowUp />
          </Button>
        {/if}

        {#if WorkflowContext.getLastPosition() > WorkflowContext.getPosition(nodeId)}
          <Button
            variant="outline"
            size="icon"
            onclick={() => {
              WorkflowContext.moveNode(nodeId, "down");
            }}
          >
            <ArrowDown />
          </Button>
        {/if}
      </div>
      <div>
        <Checkbox
          id="visibleInUI"
          checked={visible}
          onclick={(e) => {
            onVisibilityChange(!visible);
          }}
        />
        <Label for="visibleInUI">Visible in UI</Label>
      </div>
    </div>
  {/if}
</div>
