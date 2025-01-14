<script>
  import { capitalizeFirstLetter } from "../../helpers/helpers";
  import { onMount } from "svelte";
  import InputNumber from "/imports/ui/components/InputNumber.svelte";
  import InputSlider from "/imports/ui/components/InputSlider.svelte";
  import TextareaInput from "/imports/ui/components/common/TextareaInput.svelte";

  let { nodeId, inputKey, inputValue } = $props();

  let isNumber = typeof inputValue === "number";
  let isFloat = isNumber && inputValue <= 1.0;
  let step = isFloat ? 0.01 : 1;
  let max = isFloat ? 1 : inputKey === "seed" ? 10000000000000000 : 100;
  let textareaElement;
</script>

<div id={`${nodeId}-${inputKey}`} class="flex flex-col space-y-1">
  {#if isNumber}
    <label for={`${nodeId}-${inputKey}`} class="text-neutral-500"
      >{capitalizeFirstLetter(inputKey)}</label
    >
    <div class="flex items-center space-x-4">
      {#if inputKey === "seed"}
        <InputNumber {inputKey} {inputValue} {nodeId} {step} {max} />
      {:else}
        <InputNumber
          {inputKey}
          {inputValue}
          {nodeId}
          {step}
          {max}
          customClass="w-1/4"
        />
        <InputSlider
          {inputKey}
          {inputValue}
          {nodeId}
          {step}
          {max}
          customClass="w-1/4"
        />
      {/if}
    </div>
  {:else}
    <TextareaInput {inputKey} {inputValue} />
  {/if}
</div>
