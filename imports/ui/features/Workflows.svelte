<script>
  import { Meteor } from "meteor/meteor";
  import { FlowRouter } from "meteor/ostrio:flow-router-extra";
  import Workflow from "./Workflow.svelte";

  let workflowLoaded = $state(false);
  let workflow = $state(null);

  $effect.pre(async () => {
    const workflowId = FlowRouter.getParam("id");
    // console.log("workflowId", workflowId);
    if (workflowId) {
      workflow = await Meteor.callAsync("workflows.getById", workflowId);
      workflowLoaded = true;
      // console.log("workflow", workflow);
    }
  });
</script>

{#if workflowLoaded}
  <Workflow
    _id={workflow._id}
    name={workflow.name}
    workflow={workflow.workflow}
    nodeOrder={workflow.nodeOrder}
  />
{:else}
  <div class="mt-4 text-lg text-gray-600">Loading workflow...</div>
{/if}
