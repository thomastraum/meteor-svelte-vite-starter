<script>
  import { fade } from "svelte/transition";
  import RunStatusProcessing from "/imports/ui/components/RunStatusProcessing.svelte";
  import RunStatusFailed from "/imports/ui/components/RunStatusFailed.svelte";
  import RunFinished from "/imports/ui/components/RunFinished.svelte";
  import RunStatusLoading from "/imports/ui/components/RunStatusLoading.svelte";

  import { Meteor } from "meteor/meteor";
  import { Tracker } from "meteor/tracker";
  import { RunsCollection } from "/imports/api/runs/collections";
  import { GENERATED_ROUTE } from "/imports/startup/both/";

  import ButtonFullscreen from "/imports/ui/components/common/ButtonFullscreen.svelte";

  let runsSubscription = Meteor.subscribe("runs.all");
  let subIsReady = $state(false);
  let allRuns = $state([]);
  let lastRun = $state({});
  const workflowId = FlowRouter.getParam("id");

  $effect(() => {
    const computation = Tracker.autorun(() => {
      subIsReady = runsSubscription.ready();
      if (subIsReady) {
        console.log("sub is ready, getting runs");
        allRuns = RunsCollection.find(
          { workflowId },
          { sort: { createdAt: -1 }, skip: 1, limit: 5 },
        ).fetch();
        lastRun = RunsCollection.findOne({}, { sort: { createdAt: -1 } });
      }
    });
    return () => {
      computation.stop();
    };
  });

  let isFullscreen = $state(false);
</script>

<!-- <h1 class="">Runs</h1> -->

{#if subIsReady && lastRun}
  <div
    class={isFullscreen ? "fixed inset-0 z-50 bg-background overflow-auto" : ""}
    transition:fade
  >
    <div class="relative {isFullscreen ? 'p-4' : ''}">
      <div class="flex justify-between items-center">
        <h2 class="font-bold text-2xl">Latest Run</h2>
        <ButtonFullscreen
          {isFullscreen}
          onclick={() => {
            isFullscreen = !isFullscreen;
          }}
        />
      </div>
      <div class="mt-4">
        {#if lastRun.status === "finished"}
          <RunFinished run={lastRun} />
        {:else if lastRun.status === "failed"}
          <RunStatusFailed error={lastRun.error} />
        {:else if lastRun.status === "loading" || lastRun.status === "starting up..."}
          <RunStatusLoading status={lastRun.status} />
        {:else if lastRun.status === "processing" || lastRun.status === "starting" || lastRun.status === "done!"}
          <RunStatusProcessing
            progress={lastRun.progress}
            status={lastRun.status}
          />
        {/if}
      </div>
    </div>
  </div>
  <h2 class="mt-4">Previous Runs</h2>
  {#each allRuns as run}
    <div class="mt-4">
      {#if run.status === "finished"}
        <RunFinished {run} />
      {:else if run.status === "failed"}
        <RunStatusFailed error={run.error} />
      {/if}
    </div>
  {/each}
  <div class="mt-4">
    <button
      class="w-full border border-neutral-600 text-white font-bold py-2 px-4 rounded hover:bg-neutral-500"
      onclick={() => FlowRouter.go("runs")}
    >
      See all runs
    </button>
  </div>
{:else if !subIsReady}
  <p class="text-center text-gray-600">Loading...</p>
{:else}
  <p class="text-center text-gray-600">No runs available.</p>
{/if}
