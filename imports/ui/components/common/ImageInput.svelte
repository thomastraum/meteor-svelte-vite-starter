<script>
  import { UPLOAD_ROUTE } from "/imports/startup/both/";
  import SelectComponent from "/imports/ui/components/common/SelectComponent.svelte";
  let { imageType, inputValue, imageTypes, onchange } = $props();
  let options = imageTypes.map((type) => ({ value: type, label: type }));
</script>

<div class="py-4 flex flex-col space-y-4">
  <SelectComponent
    key={imageType}
    {options}
    value={options[inputValue]}
    oninput={(e) => onchange(e.target.value)}
  />

  <select
    {onchange}
    value={imageType}
    class="p-2 border rounded-md bg-neutral-800"
  >
    {#each imageTypes as type}
      <option value={type}>{type}</option>
    {/each}
  </select>
  <div class="h-full w-full flex items-center justify-center">
    <img src={`${UPLOAD_ROUTE}/${inputValue}`} alt="" class="" />
  </div>
</div>
