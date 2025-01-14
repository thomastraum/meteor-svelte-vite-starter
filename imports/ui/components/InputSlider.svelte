<script lang="ts">
  import * as Slider from "$lib/components/ui/slider";
  import { Label } from "$lib/components/ui/label";
  import { Tooltip } from "$lib/components/ui/tooltip";

  let {
    key,
    value,
    min = 0,
    max = 100,
    step = 0.1,
    tooltipText,
    oninput,
  } = $props();

  let currentValue = $state(value[0]);

  function onValueChange(val) {
    currentValue = val[0];
    if (oninput) {
      oninput(currentValue);
    }
  }
</script>

<div class="grid gap-2">
  <div class="flex justify-between">
    <Label for={key}>{key}</Label>

    <span class="text-muted-foreground text-sm">
      {currentValue}
    </span>
  </div>
  <Slider.Root
    value={[currentValue]}
    {onValueChange}
    {max}
    {min}
    {step}
    class="relative flex items-center select-none touch-none w-full"
  >
    <Slider.Track
      class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
    >
      <Slider.Range class="absolute h-full bg-primary" />
    </Slider.Track>
    <Slider.Thumb
      class="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    />
  </Slider.Root>
</div>
