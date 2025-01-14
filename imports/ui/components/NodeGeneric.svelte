<script>
  import { NodeInfoCollection } from "/imports/api/nodes/collection";
  import LoadImage from "/imports/ui/components/LoadImage.svelte";
  import { Meteor } from "meteor/meteor";
  import { Tracker } from "meteor/tracker";

  import { getContext } from "svelte";

  import NodeHeader from "/imports/ui/components/NodeHeader.svelte";
  import SelectComponent from "/imports/ui/components/common/SelectComponent.svelte";
  import { debounce, capitalizeFirstLetter } from "/imports/ui/helpers/helpers";

  import InputSlider from "/imports/ui/components/InputSlider.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import TextareaInput from "/imports/ui/components/common/TextareaInput.svelte";

  let { node, nodeId } = $props();
  let WorkflowContext = getContext("WorkflowContext");
  let UiState = getContext("UiState");
  let shouldShow = $derived(UiState.editing || node._meta?.visible);

  let nodeInfoSubscription = Meteor.subscribe("nodeInfo.name", node.class_type);
  let subIsReady = $state(false);
  let nodeInfo = {};
  let nodeInfoIsReady = $state(false);

  $effect(() => {
    const computation = Tracker.autorun(() => {
      subIsReady = nodeInfoSubscription.ready();
      if (subIsReady) {
        nodeInfo = NodeInfoCollection.findOne({ name: node.class_type });
        nodeInfoIsReady = true;
      }
    });
    return () => {
      computation.stop();
    };
  });

  function updateNode(updates) {
    WorkflowContext.updateNode(nodeId, {
      ...node,
      ...updates,
    });
  }

  // Modified helper function to handle array types
  function getInputConfig(value) {
    const [type, config] = value;
    if (Array.isArray(type)) {
      return {
        type: "SELECT",
        options: type.map((option) => ({ value: option, label: option })),
        ...config,
      };
    }
    return {
      type,
      ...config,
    };
  }
</script>

{#if shouldShow}
  <div
    id={nodeId}
    class="border rounded-xl flex flex-col space-y-4 shadow pb-4"
  >
    {#if subIsReady && nodeInfoIsReady}
      <NodeHeader
        {node}
        {nodeId}
        onVisibilityChange={(val) =>
          updateNode({
            _meta: { ...node._meta, visible: val },
          })}
      />
      <div class="px-6 py-2 flex flex-col space-y-5">
        {#each Object.entries(nodeInfo.input.required) as [key, value]}
          {@const config = getInputConfig(value)}
          {#if config.image_upload}
            <div class="flex flex-col space-y-2">
              <LoadImage
                {node}
                {nodeId}
                onchange={(value) =>
                  updateNode({
                    inputs: { ...node.inputs, [key]: value },
                  })}
              />
            </div>
          {:else if config.type === "INT"}
            <div class="flex flex-col space-y-2">
              <Label for={key}>{capitalizeFirstLetter(key)}</Label>
              <Input
                type="number"
                id={key}
                placeholder={[node.inputs[key]]}
                oninput={(e) =>
                  updateNode({
                    inputs: { ...node.inputs, [key]: e.target.value },
                  })}
              />
            </div>
          {:else if config.type === "FLOAT"}
            <div class="flex flex-col space-y-2">
              <InputSlider
                {key}
                value={[node.inputs[key]]}
                min={config.min}
                max={config.max}
                step={config.type === "FLOAT" ? config.step || 0.1 : 1}
                tooltipText={config.tooltip}
                oninput={(value) => {
                  updateNode({
                    inputs: { ...node.inputs, [key]: value },
                  });
                }}
              />
            </div>
          {:else if config.type === "SELECT"}
            <div class="flex flex-col space-y-2">
              <SelectComponent
                {key}
                options={config.options}
                value={node.inputs[key]}
                oninput={(value) =>
                  updateNode({
                    inputs: { ...node.inputs, [key]: value },
                  })}
              />
              <span class="text-xs text-gray-500">{config.tooltip}</span>
            </div>
          {:else if config.type === "STRING"}
            <div class="flex flex-col space-y-2">
              <TextareaInput
                {key}
                value={node.inputs[key]}
                oninput={(e) => {
                  updateNode({
                    inputs: { ...node.inputs, [key]: e.target.value },
                  });
                }}
              />
            </div>
          {/if}
        {/each}
      </div>
    {:else}
      loading info
    {/if}
  </div>
{/if}
