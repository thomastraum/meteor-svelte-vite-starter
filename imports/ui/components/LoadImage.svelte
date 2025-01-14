<script>
  import { Meteor } from "meteor/meteor";
  import { Tracker } from "meteor/tracker";
  import { InputsCollection } from "/imports/api/inputs/inputs";
  import { UPLOAD_ROUTE } from "/imports/startup/both/";

  import NodeType from "/imports/ui/components/common/NodeType.svelte";
  import ImageInput from "/imports/ui/components/common/ImageInput.svelte";
  import SelectComponent from "/imports/ui/components/common/SelectComponent.svelte";

  let { node, nodeId, onchange } = $props();
  const imageTypes = ["beauty", "normal", "depth"];
  let options = imageTypes.map((type) => ({ value: type, label: type }));
  let imageType = $state(node.inputs.image_type || "beauty");

  let inputSubs = Meteor.subscribe("inputs.all");
  let subIsReady = $state(false);
  let latestInput = $state({});

  $effect.pre(() => {
    const computation = Tracker.autorun(() => {
      subIsReady = inputSubs.ready();
      if (subIsReady) {
        latestInput = InputsCollection.findOne(
          { imageType: imageType },
          { sort: { createdAt: -1 } },
        );
      }
      return null;
    });
    return () => {
      computation.stop();
    };
  });

  // $inspect(node.inputs.image_type);
</script>

{#if subIsReady}
  {#if latestInput}
    <div class="flex flex-col gap-4">
      <SelectComponent
        key={imageType}
        {options}
        value={options[latestInput.filename]}
        oninput={(type) => {
          imageType = type;
          node.inputs.image_type = imageType;
          node.inputs.image = latestInput.filename;
          onchange(nodeId, node);
        }}
      />
      <div class="h-full w-full flex items-center justify-center">
        <div class="overflow-hidden rounded-md">
          <img
            class="h-auto w-auto object-cover transition-all"
            src={`${UPLOAD_ROUTE}/${latestInput.filename}`}
            alt={latestInput.filename}
          />
        </div>
      </div>
    </div>
  {:else}
    <div class="text-gray-600">
      No inputs found, check the <a href="/inputs">inputs page</a>
    </div>
  {/if}
{:else}
  <div class="text-gray-600">Loading images...</div>
{/if}
