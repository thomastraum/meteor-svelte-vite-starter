<script>
  import { Meteor } from "meteor/meteor";
  import { Tracker } from "meteor/tracker";
  import { InputsCollection } from "/imports/api/inputs/inputs";
  import { UPLOAD_ROUTE } from "/imports/startup/both/";
  import { formatDate } from "/imports/ui/helpers/helpers";
  import Info from "/imports/ui/components/common/Info.svelte";

  let inputSubs = Meteor.subscribe("inputs.all");
  let subIsReady = $state(false);
  let inputs = $state([]);
  let runsCount = $state(0);

  $effect(() => {
    const computation = Tracker.autorun(() => {
      subIsReady = inputSubs.ready();
      if (subIsReady) {
        console.log("sub is ready, getting inputs");
        inputs = InputsCollection.find({}, { sort: { createdAt: -1 } }).fetch();
      }
    });
    return () => {
      computation.stop();
    };
  });
</script>

<h2 class="sr-only">Inputs</h2>
<Info />
{#if subIsReady}
  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-4"
  >
    {#each inputs as input}
      <a href={"#"} class="group">
        <div
          class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg xl:aspect-h-8 xl:aspect-w-7 border border-gray-400/20 p-5"
        >
          <img
            loading="lazy"
            src={`${UPLOAD_ROUTE}/${input.filename}`}
            alt="Latest input "
            class="w-full h-auto rounded-md shadow-sm font-medium"
          />
          <p class="mt-4 font-medium text-xs text-gray-400">
            {formatDate(input.createdAt)}
          </p>
          <p class="mt-4">
            <span
              class="rounded-full px-4 py-2 text-xs font-medium ring-1 ring-inset {input.imageType ===
              'normal'
                ? 'bg-blue-400/10 text-blue-400 ring-blue-400/20'
                : input.imageType === 'depth'
                  ? 'bg-green-400/10 text-green-400 ring-green-400/20'
                  : 'bg-gray-400/10 text-gray-400 ring-gray-400/20'}"
            >
              {input.imageType}
            </span>
          </p>
        </div>
      </a>
    {:else}
      <div class="text-gray-600">No inputs found</div>
    {/each}
  </div>
{:else}
  <div class="text-gray-600">Loading...</div>
{/if}
