<script>
  import { Meteor } from "meteor/meteor";
  import { Tracker } from "meteor/tracker";
  import { FlowRouter } from "meteor/ostrio:flow-router-extra";
  import { RunsCollection } from "/imports/api/runs/collections";
  import RunFinished from "/imports/ui/components/RunFinished.svelte";
  import RunStatusProcessing from "/imports/ui/components/RunStatusProcessing.svelte";
  import RunStatusFailed from "/imports/ui/components/RunStatusFailed.svelte";

  let runsSubscription = Meteor.subscribe("runs.all");
  let subIsReady = $state(false);
  let runs = $state([]);
  let runsCount = $state(0);

  $effect(() => {
    const computation = Tracker.autorun(() => {
      subIsReady = runsSubscription.ready();
      if (subIsReady) {
        console.log("sub is ready, getting workflow");
        runs = RunsCollection.find({}, { sort: { createdAt: -1 } }).fetch();
        runsCount = RunsCollection.find().count();
      }
    });
    return () => {
      computation.stop();
    };
  });
</script>

<h2 class="sr-only">Runs</h2>
{#if subIsReady}
  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-4"
  >
    {#if runs.length}
      {#each runs as run}
        <a href={"#"} class="group">
          <div
            class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg xl:aspect-h-8 xl:aspect-w-7 border border-gray-400/20 p-5"
          >
            {#if run.status === "failed"}
              <RunStatusFailed error={run.error} />
            {:else if run.status === "running" || run.status === "starting"}
              <RunStatusProcessing progress={run.progress} />
            {:else}
              <RunFinished {run} />
            {/if}
          </div>
        </a>
      {/each}
    {:else}
      <h2 class="tracking-tight font-bold text-2xl">
        No runs yet. run a <a href={FlowRouter.url("home")} class="underline"
          >workflow</a
        >.
      </h2>
    {/if}
  </div>
{/if}
