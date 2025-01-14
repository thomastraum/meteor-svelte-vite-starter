<script>
  import { Meteor } from "meteor/meteor";
  import { FlowRouter } from "meteor/ostrio:flow-router-extra";

  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { Label } from "$lib/components/ui/label/index.ts";
  import { Input } from "$lib/components/ui/input";
  import Button from "$lib/components/ui/button/button.svelte";

  let name = "";
  let jsonInput = "";
  let error = "";

  async function handleSubmit(event) {
    event.preventDefault();
    error = "";

    try {
      const workflowData = JSON.parse(jsonInput);
      const workflowId = await Meteor.callAsync("workflows.insert", {
        name,
        workflow: workflowData,
        nodeOrder: Object.keys(workflowData),
      });
      FlowRouter.go(`/render/${workflowId}/edit`);
    } catch (err) {
      console.error("Error inserting workflow:", err);
      console.log(err);
      error = err || "Error saving workflow. Please try again.";
    }
  }
</script>

<div class="py-4">
  <h1 class="text-2xl font-bold mb-4">Add New Workflow</h1>

  {#if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <span class="block sm:inline">{error}</span>
    </div>
  {/if}

  <form onsubmit={handleSubmit} class="space-y-4">
    <div class="flex flex-col space-y-2">
      <Label for="name">Workflow Name</Label>
      <Input id="name" type="text" bind:value={name} />
    </div>
    <div class="flex flex-col space-y-2">
      <Label for="json">Workflow JSON</Label>
      <Textarea
        id="json"
        placeholder="Enter your JSON here"
        bind:value={jsonInput}
        class="min-h-[200px] flex-1 p-4"
      />
    </div>

    <Button type="submit">Save Workflow</Button>
  </form>
</div>
