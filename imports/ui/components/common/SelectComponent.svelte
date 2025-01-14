<script>
  import * as Select from "$lib/components/ui/select/index.ts";
  import { derived } from "svelte/store";
  let { options, value = $bindable(), oninput, key } = $props();

  const triggerContent = $derived(
    options.find((s) => s.value === value)?.label ?? `${key}`,
  );
</script>

<div class="flex flex-col">
  <Select.Root
    type="single"
    name="optNames"
    {value}
    onValueChange={(selectedValue) => {
      value = selectedValue;
      oninput(selectedValue);
    }}
  >
    <Select.Trigger class="w-full">
      {triggerContent}
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        <Select.GroupHeading>Options</Select.GroupHeading>
        {#each options as option}
          <Select.Item value={option.value} label={option.label} />
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>
</div>
