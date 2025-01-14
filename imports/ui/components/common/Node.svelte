<!-- generaic node component  for the workflow editing page -->

<script>
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  import ChevronUp from "lucide-svelte/icons/chevron-up";
  import ChevronDown from "lucide-svelte/icons/chevron-down";
  import VisibleInUI from "/imports/ui/components/VisibleInUI.svelte";
  import EditTitle from "/imports/ui/components/common/EditTitle.svelte";
  import { debounce, capitalizeFirstLetter } from "/imports/ui/helpers/helpers";

  import InputNumber from "/imports/ui/components/InputNumber.svelte";
  import InputSlider from "/imports/ui/components/InputSlider.svelte";
  import TextareaInput from "/imports/ui/components/common/TextareaInput.svelte";

  let { nodeId, node, index, workflow, reorderNodes, updateNodeInWorkflow } =
    $props();

  const debouncedUpdateNodeInWorkflow = debounce(updateNodeInWorkflow, 1000);

  function updateNodeInputs(inputKey, inputValue) {
    console.log("updateNodeInputs", inputKey, inputValue);
    node.inputs[inputKey] = inputValue;
    debouncedUpdateNodeInWorkflow(nodeId, node);
  }
  function getNodeTitleOrType() {
    return node._meta?.title || node.class_type;
  }
  function updateNodeTitle(title) {
    console.log("updateNodeTitle", title);
    node["_meta"] ??= {};
    node["_meta"].title = title;
    debouncedUpdateNodeInWorkflow(nodeId, node);
  }
</script>

<div id={nodeId} class="border rounded-xl flex flex-col space-y-4 shadow pb-4">
  <div class="px-6 py-4 flex justify-between items-center border-b">
    <div class="flex items-center">
      <h3 class="pr-4">{nodeId}</h3>
      <EditTitle
        title={getNodeTitleOrType()}
        oninput={(e) => {
          updateNodeTitle(e.target.value);
        }}
      />
    </div>
    <div class="flex items-center">
      <div class="mr-4">
        <VisibleInUI
          visible={node._meta?.visible}
          onchange={(e) => {
            node["_meta"] ??= {};
            node._meta.visible = e.target.checked;
            debouncedUpdateNodeInWorkflow(nodeId, node);
          }}
        />
      </div>
      <div>
        {#if index !== 0}
          <Button
            variant="outline"
            size="icon"
            onclick={() => reorderNodes(index, "up")}
          >
            <ChevronUp />
          </Button>
        {/if}
        {#if index !== Object.keys(workflow.workflow).length - 1}
          <Button
            variant="outline"
            size="icon"
            onclick={() => reorderNodes(index, "down")}
          >
            <ChevronDown />
          </Button>
        {/if}
      </div>
    </div>
  </div>
  <div class="px-6 py-2 flex flex-col space-y-5">
    <!-- node properties -->
    {#each Object.entries(node.inputs) as [inputKey, inputValue]}
      {#if Array.isArray(inputValue)}
        <!-- its the connections: -->
        <!-- <div class="flex items-center">
          <span class="mr-2">{inputKey}:</span>
          <span>
            {console.log("inputValue:", inputValue)}
            {#if inputValue[0]}
              <p class="">
                {workflow.workflow[inputValue[0]]._meta?.title}
              </p>{/if}
          </span>
        </div> -->
      {:else}
        <!-- its a normal input: -->
        <!-- create the default input fields -->
        <!-- <InputField {nodeId} {inputKey} {inputValue} /> -->
        <div id={`${nodeId}-${inputKey}`} class="flex flex-col space-y-1">
          {#if typeof inputValue === "number"}
            <InputSlider
              key={inputKey}
              value={[inputValue]}
              min={0}
              max={100}
              oninput={(value) => {
                updateNodeInputs(inputKey, value);
              }}
            />
          {:else}
            <!-- {JSON.stringify(inputValue)} -->
            <TextareaInput
              {inputKey}
              {inputValue}
              oninput={(e) => {
                // console.log("value: ", e.target.value);
                updateNodeInputs(inputKey, e.target.value);
              }}
            />
          {/if}
        </div>
      {/if}
    {/each}
  </div>
</div>
