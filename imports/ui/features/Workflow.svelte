<script>
  import { Meteor } from "meteor/meteor";
  import { Log } from "meteor/logging";
  import { debounce } from "/imports/ui/helpers/helpers";
  import { FlowRouter } from "meteor/ostrio:flow-router-extra";
  import { setContext } from "svelte";
  import { flip } from "svelte/animate";

  import StickyButton from "/imports/ui/components/StickyButton.svelte";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  import NodeGeneric from "/imports/ui/components/NodeGeneric.svelte";

  let {
    _id,
    name,
    workflow,
    nodeOrder,
    isAutoRender = $bindable(false),
  } = $props();

  let currentWorkflow = $state(workflow);
  let currentNodeOrder = $state(nodeOrder);
  let isLoading = $state(false);
  let debouncedSubmit;

  async function handleSubmit(event) {
    if (event) event.preventDefault();

    if (isLoading) {
      return;
    }
    // TODO: Check if the workflow is the same as the last run

    isLoading = true;
    try {
      Log.info(workflow);
      const result = await Meteor.callAsync("newRun", _id, workflow);
      Log.info(result);
      // Handle successful generation (e.g., display the generated image)
    } catch (error) {
      Log.error("Error generating image:", error);
      // Handle error (e.g., display error message to user)
    } finally {
      isLoading = false;
    }
  }

  async function saveWorkflow() {
    const result = await Meteor.callAsync("workflows.update", _id, {
      workflow: currentWorkflow,
    });
    if (isAutoRender) {
      debouncedSubmit(null);
    }
  }

  async function saveOrder() {
    const result = await Meteor.callAsync("workflows.update", _id, {
      nodeOrder: currentNodeOrder,
    });
  }

  let UiState = $state({
    editing: FlowRouter.getParam("edit") === "edit" ? true : false,
  });
  setContext("UiState", UiState);

  let WorkflowContext = {
    updateNode: debounce((nodeId, node) => {
      currentWorkflow = {
        ...currentWorkflow,
        [nodeId]: node,
      };
      saveWorkflow();
    }, 1000),
    moveNode: (nodeId, direction) => {
      const currentIndex = currentNodeOrder.indexOf(nodeId);
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (newIndex >= 0 && newIndex < currentNodeOrder.length) {
        // Update the order array
        const newOrder = [...currentNodeOrder];
        [newOrder[currentIndex], newOrder[newIndex]] = [
          newOrder[newIndex],
          newOrder[currentIndex],
        ];
        currentNodeOrder = newOrder;
        saveOrder();
      }
    },
    getPosition: (nodeId) => currentNodeOrder.indexOf(nodeId),
    getLastPosition: () => currentNodeOrder.length - 1,
  };

  setContext("WorkflowContext", WorkflowContext);

  // $effect(() => {
  //   $inspect("Node order:", currentNodeOrder);
  //   $inspect("Current workflow keys:", Object.keys(currentWorkflow));
  // });
</script>

<div class="mt-2">
  <div
    class="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-4 border-b"
  >
    <h1 class="font-bold text-2xl">
      {name}
    </h1>
    <div class="flex items-center space-x-2">
      <Label
        for="airplane-mode"
        class="text-sm {UiState.editing
          ? 'text-foreground'
          : 'text-muted-foreground'}"
      >
        Editing
      </Label>
      <Switch id="airplane-mode" bind:checked={UiState.editing} />
    </div>
  </div>
  {#if currentWorkflow}
    <form onsubmit={handleSubmit} class="flex flex-col">
      <div class="py-4 flex flex-col space-y-5">
        <div class="mt-4">
          <Checkbox id="autorender" bind:checked={isAutoRender} />
          <Label for="autorender" class="pl-2 text-base">Auto render</Label>
        </div>
        {#each currentNodeOrder as nodeId (nodeId)}
          <div animate:flip={{ duration: 300 }}>
            <NodeGeneric {nodeId} node={currentWorkflow[nodeId]} />
          </div>
        {/each}
      </div>
      <StickyButton
        text={isLoading ? "Running Workflow" : "Run Workflow"}
        disabled={isLoading}
        onclick={handleSubmit}
      />
    </form>
  {:else}
    <p class="text-gray-600">No workflow data available.</p>
  {/if}
</div>
