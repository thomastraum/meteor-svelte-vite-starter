<script>
  // this is the old overview page. had some nice transitions and deletions.

  import { Meteor } from "meteor/meteor";
  import { Tracker } from "meteor/tracker";
  import { WorkflowsCollection } from "/imports/api/workflows/collections";
  import WorkflowListItem from "/imports/ui/components/WorkflowListItem.svelte";
  import WorkflowItemAdd from "/imports/ui/components/WorkflowItemAdd.svelte";
  import Workflow from "../features/Workflow.svelte";
  import { onMount, onDestroy } from "svelte";

  let workflowSubs = Meteor.subscribe("workflows.workflowOnly");
  let subIsReady = $state(false);
  let workflows = $state([]);
  let computation;

  $effect.pre(() => {
    computation = Tracker.autorun(() => {
      subIsReady = workflowSubs.ready();
      if (subIsReady) {
        workflows = WorkflowsCollection.find(
          {},
          { sort: { createdAt: -1 }, fields: { runs: 1, name: 1 } },
        ).fetch();
        console.log("length: ", workflows.length);
      }
    });

    return () => {
      if (computation) {
        computation.stop();
      }
    };
  });
</script>

<div class="">
  <h1 class="py-4">All Workflows</h1>

  <ul role="list" class="divide-y divide-white/5">
    <WorkflowItemAdd />
    {#if subIsReady}
      {#if workflows.length > 0}
        {#each workflows as workflow}
          <!-- added key so it refreshes correctly after a transition -->
          {#key workflow._id}
            <WorkflowListItem {workflow} />
          {/key}
        {/each}
      {:else}
        <li
          class="relative flex items-center space-x-4 py-4 text-white rounded-lg p-5"
        >
          No workflows available. Create one!
        </li>
      {/if}
    {:else}
      <li
        class="relative flex items-center space-x-4 py-4 text-white rounded-lg p-5"
      >
        Loading workflows...
      </li>
    {/if}
  </ul>
</div>
