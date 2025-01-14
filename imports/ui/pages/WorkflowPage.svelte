<!-- edit a workflow -->

<script>
  import { Meteor } from "meteor/meteor";
  import { Tracker } from "meteor/tracker";
  import { WorkflowsCollection } from "/imports/api/workflows/collections";
  import { FlowRouter } from "meteor/ostrio:flow-router-extra";
  import { onMount } from "svelte";

  import WorkflowPageHeader from "/imports/ui/components/common/WorkflowPageHeader.svelte";

  import NodeGeneric from "/imports/ui/components/NodeGeneric.svelte";
  import RocketIcon from "/imports/ui/components/common/RocketIcon.svelte";
  let workflowSubs = Meteor.subscribe("workflows.all");
  let subIsReady = $state(false);
  let workflow = $state(null);
  let showVisibleOnly = $state(false);

  function reorderNodes(oldIndex, direction) {
    // Math.min(Object.keys(workflow.workflow).length - 1, index + 1)
    let newIndex;
    if (direction === "up") {
      newIndex = Math.max(0, oldIndex - 1);
    } else {
      newIndex = Math.min(
        Object.keys(workflow.workflow).length - 1,
        oldIndex + 1,
      );
    }
    const entries = Object.entries(workflow.workflow);
    const [movedNode] = entries.splice(oldIndex, 1);
    entries.splice(newIndex, 0, movedNode);

    const newWorkflow = {};
    const oldToNewIdMap = {};

    entries.forEach(([oldId, node], index) => {
      const newId = (index + 1).toString();
      oldToNewIdMap[oldId] = newId;
      newWorkflow[newId] = { ...node };
    });

    // Update all connections
    for (const [newId, node] of Object.entries(newWorkflow)) {
      if (node.inputs) {
        for (const [inputKey, inputValue] of Object.entries(node.inputs)) {
          if (Array.isArray(inputValue)) {
            const [connectedNodeId, outputIndex] = inputValue;
            if (oldToNewIdMap[connectedNodeId]) {
              node.inputs[inputKey] = [
                oldToNewIdMap[connectedNodeId],
                outputIndex,
              ];
            }
          }
        }
      }
    }

    workflow.workflow = newWorkflow;
    updateWorkflow();
  }

  function updateNodeInWorkflow(nodeId, node) {
    console.log("updateWorkflow with updatednode: ", nodeId);
    workflow.workflow[nodeId] = node;
    updateWorkflow();
  }

  function updateWorkflow() {
    console.log("updateWorkflow: ", workflow._id);
    Meteor.call("workflows.update", workflow._id, {
      workflow: workflow.workflow,
    });
  }

  $effect(() => {
    const computation = Tracker.autorun(() => {
      subIsReady = workflowSubs.ready();
      if (subIsReady) {
        console.log("sub is ready, getting workflow");
        workflow = WorkflowsCollection.findOne({
          _id: FlowRouter.getParam("id"),
        });
      }
    });
    return () => {
      computation.stop();
    };
  });
</script>

{#if subIsReady}
  <div class="mt-2">
    <div class="flex justify-between items-center">
      <WorkflowPageHeader
        name={workflow.name}
        _id={workflow._id}
        {showVisibleOnly}
        onclick={() => {
          showVisibleOnly = !showVisibleOnly;
        }}
      />
    </div>
    <div class="mt-2 flex flex-col space-y-5">
      {#each Object.entries(workflow.workflow) as [nodeId, node], index}
        {#if showVisibleOnly}
          {#if node._meta?.visible}
            <NodeGeneric
              {nodeId}
              {node}
              {index}
              {workflow}
              {reorderNodes}
              onchange={updateNodeInWorkflow}
            />
          {/if}
        {:else}
          <NodeGeneric
            {nodeId}
            {node}
            {index}
            {workflow}
            {reorderNodes}
            onchange={updateNodeInWorkflow}
          />
        {/if}
      {/each}
    </div>
  </div>
{/if}
