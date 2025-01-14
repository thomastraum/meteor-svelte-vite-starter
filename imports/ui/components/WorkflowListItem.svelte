<script>
  import { Meteor } from "meteor/meteor";
  import { fade } from "svelte/transition";

  let { workflow, initialVisible } = $props();
  let visible = $state(true);

  async function deleteWorkflow(id) {
    await Meteor.callAsync("workflows.remove", id);
  }

  //  transition:fade
  // onoutroend={() => deleteWorkflow(workflow._id)}
</script>

{#if visible}
  <li
    class="relative flex items-center space-x-4 py-4 p-5"
    transition:fade
    onoutroend={() => deleteWorkflow(workflow._id)}
  >
    <div class="min-w-0 flex-auto">
      <div class="flex items-center gap-x-3">
        <div class="flex-none rounded-full bg-gray-100/10 p-1 text-gray-500">
          <div class="h-2 w-2 rounded-full bg-current"></div>
        </div>
        <h2 class="min-w-0 text-sm font-semibold leading-6 text-white">
          <a href={`/workflows/${workflow._id}`} class="flex gap-x-2">
            <span class="truncate">{workflow.name}</span>
          </a>
        </h2>
      </div>
      <div
        class="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400"
      >
        {#if workflow.runs?.length}
          <p class="truncate">
            {workflow.runs.length}
            {workflow.runs.length === 1 ? "run" : "runs"}
          </p>
        {:else}
          <p class="truncate">No runs yet</p>
        {/if}
        <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 flex-none fill-gray-300">
          <circle cx="1" cy="1" r="1" />
        </svg>
        <p class="whitespace-nowrap">Initiated 1m 32s ago</p>
      </div>
    </div>
    <div
      class="flex-none rounded-full bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20"
    >
      SD-XL
    </div>
    <button
      onclick={() => (visible = false)}
      class="flex-none rounded-full bg-red-400/50 px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-400/20 mr-5"
    >
      x
    </button>
    <a href="/workflows/{workflow._id}">
      <svg
        class="h-5 w-5 flex-none text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        aria-label="View workflow"
      >
        <path
          fill-rule="evenodd"
          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
          clip-rule="evenodd"
        />
      </svg>
    </a>
  </li>
{/if}
