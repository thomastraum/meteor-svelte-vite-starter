<script>
  import { capitalizeFirstLetter } from "/imports/ui/helpers/helpers.js";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { Label } from "$lib/components/ui/label/index.ts";
  let { key, value, oninput } = $props();
</script>

<div class="flex flex-col space-y-2">
  <Label for={`${key}`}>{capitalizeFirstLetter(key)}</Label>
  <Textarea
    placeholder="Type your message here."
    {value}
    {oninput}
    class="min-h-[100px] max-h-[400px] flex-1 p-4 resize-y"
  />
</div>
