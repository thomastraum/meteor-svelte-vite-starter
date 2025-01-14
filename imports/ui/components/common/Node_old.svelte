<script>
  import InputField from "/imports/ui/components/common/InputField.svelte";
  import { capitalizeFirstLetter } from "/imports/ui/helpers/helpers";
  export let node;
  export let nodeId;
  export let updateInputValue;

  function getNodeInputs(node) {
    // console.log(getNodeClass(node));
    return node.inputs || {};
  }

  function handleInput(e) {
    updateInputValue(nodeId, inputKey, inputValue);
  }
</script>

<div class="border border-neutral-600 p-2 rounded bg-neutral-900 p-4">
  {#each Object.entries(getNodeInputs(node)) as [inputKey, inputValue]}
    {#if typeof inputValue == "string"}
      <label for={`${nodeId}-${inputKey}`} class="text-neutral-500"
        >{capitalizeFirstLetter(inputKey)}</label
      >
      <textarea
        id={`${nodeId}-${inputKey}`}
        class="border border-neutral-600 w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-inherit text-neutral-300"
        bind:value={inputValue}
        on:input={handleInput}
        rows="5"
      />
    {/if}
  {/each}
</div>
