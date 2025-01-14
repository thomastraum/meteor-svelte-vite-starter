<script>
  import NodeType from "/imports/ui/components/common/NodeType.svelte";
  import TextareaInput from "/imports/ui/components/common/TextareaInput.svelte";
  import NodeHeader from "/imports/ui/components/NodeHeader.svelte";
  import { debounce } from "/imports/ui/helpers/helpers";

  let { node, nodeId, onchange } = $props();

  const debouncedUpdateWorkflow = debounce(onchange, 1000);

  function updateNodeInputs(inputKey, inputValue) {
    console.log("updateNodeInputs", inputKey, inputValue);
    node.inputs[inputKey] = inputValue;
    debouncedUpdateWorkflow(nodeId, node);
  }

  // $inspect(node);
</script>

<div class="border rounded-xl flex flex-col space-y-4 shadow pb-4">
  <NodeHeader {node} />
  <div class="px-6 py-2 flex flex-col space-y-5">
    {#each Object.entries(node.inputs) as [inputKey, inputValue]}
      {#if typeof inputValue === "string"}
        <TextareaInput
          {inputKey}
          inputValue={node.inputs[inputKey]}
          oninput={(e) => {
            updateNodeInputs(inputKey, e.target.value);
          }}
        />
      {/if}
    {/each}
  </div>
</div>
