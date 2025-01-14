<script>
  import { getMax, capitalizeFirstLetter } from "../helpers/helpers";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  let {
    inputKey,
    inputValue,
    nodeId,
    step,
    customClass = "w-full",
    oninput,
    max,
  } = $props();
</script>

<div class="">
  <Label for={`${nodeId} - ${inputKey}`}>
    {capitalizeFirstLetter(inputKey)}
  </Label>
  <Input
    type="number"
    id={`${nodeId} - ${inputKey}`}
    value={inputValue}
    {step}
    min="0"
    {max}
    oninput={(e) => oninput({ target: { value: Number(e.target.value) } })}
  />
</div>
