<script>
  import { Meteor } from "meteor/meteor";
  import { FlowRouter } from "meteor/ostrio:flow-router-extra";
  import { Tracker } from "meteor/tracker";
  import { WorkflowsCollection } from "/imports/api/workflows/collections";
  import WorkflowCard from "/imports/ui/components/common/WorkflowCard.svelte";

  let workflowSubs = Meteor.subscribe("workflows.all");
  let subIsReady = $state(false);
  let workflows = $state([]);

  $effect.pre(() => {
    const computation = Tracker.autorun(() => {
      subIsReady = workflowSubs.ready();
      if (subIsReady) {
        workflows = WorkflowsCollection.find(
          {},
          { sort: { createdAt: -1 } },
        ).fetch();
      }
    });

    return () => {
      computation.stop();
    };
  });
</script>

<h1 class="font-bold text-2xl tracking-tight">Workflows</h1>
{#if subIsReady}
  <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="p-4 bg-muted border border-gray-600 rounded-lg">
      <h2 class="tracking-tight font-bold text-2xl">
        <a class="" href={FlowRouter.path("addWorkflow")}> Create a new one </a>
      </h2>
    </div>
    {#if workflows.length > 0}
      {#each workflows as workflow}
        <WorkflowCard
          name={workflow.name}
          runs={workflow.runs}
          _id={workflow._id}
        />
      {/each}
    {/if}
  </div>
{:else}
  <div class="mt-4 text-lg text-gray-600">Loading workflows...</div>
{/if}
