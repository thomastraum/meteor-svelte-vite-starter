<script>
  import { Meteor } from "meteor/meteor";
  //   import { SettingsCollection } from "/imports/api/settings/";
  let setting = $state({});
  let loading = $state(true);

  $effect(async () => {
    setting = await Meteor.callAsync("settings.get");
    console.log("setting", setting);
    loading = false;
  });

  function updateSettings() {
    Meteor.call("settings.update", setting);
  }

  function handleSubmit(event) {
    event.preventDefault();
    updateSettings();
  }
</script>

<h2 class="sr-only">Settings</h2>
<div
  class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-4"
>
  {#if loading}
    <div class="text-center text-gray-500">Loading...</div>
  {:else}
    <form class="space-y-6 bg-neutral-800 p-6 rounded-lg">
      {#each Object.entries(setting.settings) as [key, value]}
        <div class="flex flex-col space-y-2">
          <label for={key} class="text-sm font-medium text-neutral-300"
            >{key}</label
          >
          <input
            type="text"
            id={key}
            {value}
            class="border border-neutral-600 rounded-md p-2 bg-neutral-900 text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      {/each}
      <button
        type="submit"
        on:click={handleSubmit}
        class="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Submit
      </button>
    </form>
  {/if}
</div>
