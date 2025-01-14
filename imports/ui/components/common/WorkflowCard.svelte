<script>
  import { FlowRouter } from "meteor/ostrio:flow-router-extra";
  import { Meteor } from "meteor/meteor";
  import { GENERATED_ROUTE } from "/imports/startup/both/";
  import RunFinished from "/imports/ui/components/RunFinished.svelte";
  import EditIcon from "/imports/ui/components/common/EditIcon.svelte";
  import RocketIcon from "/imports/ui/components/common/RocketIcon.svelte";
  import { Trash } from "lucide-svelte";
  let { name, runs, _id } = $props();

  let lastRun = $state(null);
  $effect.pre(async () => {
    lastRun = await Meteor.callAsync("getLastFinishedRun", _id);
  });
  const editPageUrl = FlowRouter.url("workflowEdit", { id: _id });

  const deleteWorkflow = async (id) => {
    event.preventDefault();
    try {
      if (confirm("Are you sure you want to delete this workflow?")) {
        await Meteor.callAsync("workflows.remove", id);
      }
    } catch (error) {
      console.error("Failed to delete workflow:", error);
    }
  };
</script>

<div class="bg-muted text-card-foreground rounded-xl border shadow">
  <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
    <h3 class="tracking-tight font-bold text-2xl">
      <a href={FlowRouter.url("render", { id: _id })}
        >{name || `Workflow ${_id}`}</a
      >
    </h3>
    <!-- {`${runs?.length} runs`} -->
    <div class="flex items-center gap-2">
      <!-- <a href={editPageUrl} class="px-1">
        <EditIcon />
      </a> -->
      <a href={FlowRouter.url("render", { id: _id })} class="px-1">
        <RocketIcon />
      </a>
      <a href="#" class="px-1" onclick={() => deleteWorkflow(_id)}>
        <Trash />
      </a>
    </div>
  </div>
  <div class="p-6">
    <div class="">
      {#if lastRun}
        <RunFinished run={lastRun} />
      {:else}
        <p class="text-sm text-gray-400 mb-3">No runs yet</p>
      {/if}
    </div>
    <p class="text-muted-foreground text-xs">some info</p>
  </div>
</div>
