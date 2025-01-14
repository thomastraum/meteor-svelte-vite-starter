<script>
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { FlowRouter } from "meteor/ostrio:flow-router-extra";
  import RocketIcon from "/imports/ui/components/common/RocketIcon.svelte";
  let { _id, name, showVisibleOnly, onclick } = $props();
</script>

<h1 class="font-bold text-2xl">
  {name}
</h1>
<div class="flex items-center gap-4 justify-end">
  <button
    class="px-2 py-1 fixed bg-neutral-900 rounded left-"
    onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  >
    ⇪
  </button>
  <div class="flex items-center space-x-3">
    <Switch
      id="airplane-mode"
      onclick={() => {
        onclick();
      }}
    />
    <Label
      for="airplane-mode"
      class="text-sm {showVisibleOnly ? 'text-white' : 'text-white/50'}"
    >
      Show visible only
    </Label>
  </div>

  <!-- <button
    class="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
    onclick={() => {
      onclick();
    }}
  >
    <span>Show visible only</span>
    <EyeIcon {showVisibleOnly} />
  </button> -->
  <a
    href={FlowRouter.url("render", { id: _id })}
    class="flex items-center gap-1 text-gray-400 hover:text-white transition-colors pr-10"
  >
    <RocketIcon />
  </a>
</div>
