<script>
  import { Meteor } from "meteor/meteor";
  import { InputsCollection } from "/imports/api/inputs/inputs";

  import Input from "./Input.svelte";
  import Info from "/imports/ui/components/common/Info.svelte";

  const imageTypes = ["beauty", "depth", "normal"];

  let inputSubs = Meteor.subscribe("inputs.all");
  let subIsReady = $state(false);
  let inputs = $state([]);
  let lastInputs = $state({});

  $effect(() => {
    const computation = Tracker.autorun(() => {
      subIsReady = inputSubs.ready();
      if (subIsReady) {
        console.log("sub is ready, getting inputs");
        inputs = InputsCollection.find({}, { sort: { createdAt: -1 } }).fetch();
        lastInputs = InputsCollection.find(
          { imageType: { $in: imageTypes } },
          { sort: { createdAt: -1 }, limit: 3 },
        )
          .fetch()
          .reduce((acc, input) => {
            if (!acc[input.imageType]) {
              acc[input.imageType] = input;
            }
            return acc;
          }, {});
      }
    });
    return () => {
      computation.stop();
    };
  });

  // $m: handle = Meteor.subscribe("inputs.all");
  // $m: subIsReady = handle.ready();
  // $m: inputs = InputsCollection.find({}, { sort: { createdAt: -1 } }).fetch();
  // $m: lastInputs = InputsCollection.find(
  //   { imageType: { $in: imageTypes } },
  //   { sort: { createdAt: -1 }, limit: 3 },
  // )
  //   .fetch()
  //   .reduce((acc, input) => {
  //     if (!acc[input.imageType]) {
  //       acc[input.imageType] = input;
  //     }
  //     return acc;
  //   }, {});
</script>

<h1>Inputs</h1>
{#if subIsReady}
  {#if inputs.length > 0}
    <h2 class="text-2xl font-semibold mb-4">Last Render</h2>
    {#each imageTypes as type}
      {#if lastInputs[type]}
        <div class="flex flex-col items-center">
          <Input
            _id={lastInputs[type]._id}
            filename={lastInputs[type].filename}
            imageType={lastInputs[type].imageType}
          />
        </div>
      {/if}
    {/each}
    <h2 class="text-2xl font-semibold mb-4">Inputs</h2>
    <div
      class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
    >
      {#each inputs as input}
        <Input
          filename={input.filename}
          imageType={input.imageType}
          _id={input._id}
        />
      {/each}
    </div>
  {:else}
    <Info />
  {/if}
{:else}
  <div class="mb-4">Loading ...</div>
{/if}
