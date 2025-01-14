<script>
  import { NodeInfoCollection } from "/imports/api/nodes/collection";

  import { Meteor } from "meteor/meteor";
  import { Tracker } from "meteor/tracker";
  import NodeHeader from "/imports/ui/components/NodeHeader.svelte";
  import SelectComponent from "/imports/ui/components/common/SelectComponent.svelte";
  import { debounce, capitalizeFirstLetter } from "/imports/ui/helpers/helpers";

  import NodeType from "/imports/ui/components/common/NodeType.svelte";
  import InputNumber from "/imports/ui/components/InputNumber.svelte";
  import InputSlider from "/imports/ui/components/InputSlider.svelte";
  import TextareaInput from "/imports/ui/components/common/TextareaInput.svelte";

  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  let { node, nodeId, onchange } = $props();
  let inputs = $state(node.inputs);

  const debouncedUpdateWorkflow = debounce(onchange, 1000);

  function updateNodeInputs(inputKey, inputValue) {
    console.log("updateNodeInputs", inputKey, inputValue);
    inputs[inputKey] = inputValue;
    node.inputs = inputs;
    debouncedUpdateWorkflow(nodeId, node);
  }

  let nodeInfoSubscription = Meteor.subscribe("nodeInfo.name", node.class_type);
  let subIsReady = $state(false);
  let nodeInfo = {};

  $effect(() => {
    const computation = Tracker.autorun(() => {
      subIsReady = nodeInfoSubscription.ready();
      if (subIsReady) {
        nodeInfo = NodeInfoCollection.findOne({ name: node.class_type });
      }
    });
    return () => {
      computation.stop();
    };
  });

  // Modified helper function to handle array types
  function getInputConfig(value) {
    const [type, config] = value;

    // If type is an array, it's a select/dropdown
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

<div id={nodeId} class="border rounded-xl flex flex-col space-y-4 shadow pb-4">
  {#if subIsReady}
    <NodeHeader {node} />
    <div class="px-6 py-2 flex flex-col space-y-5">
      {#each Object.entries(nodeInfo.input.required) as [key, value]}
        {@const config = getInputConfig(value)}
        {#if config.type === "INT" || config.type === "FLOAT"}
          <div class="flex flex-col space-y-2">
            {#if config.max && config.max > 100}
              <Label for={key}>{capitalizeFirstLetter(key)}</Label>
              <Input type="number" id={key} placeholder={[inputs[key]]} />
            {:else}
              <InputSlider
                {key}
                value={[inputs[key]]}
                min={config.min}
                max={config.max}
                step={config.type === "FLOAT" ? config.step || 0.1 : 1}
                tooltipText={config.tooltip}
                oninput={(value) => updateNodeInputs(key, value)}
              />
            {/if}
          </div>
        {:else if config.type === "SELECT"}
          <div class="flex flex-col space-y-2">
            <SelectComponent
              options={config.options}
              oninput={(value) => updateNodeInputs(key, value)}
            />
            <span class="text-xs text-gray-500">{config.tooltip}</span>
          </div>
        {/if}
      {/each}
    </div>
  {:else}
    loading info
  {/if}
</div>
