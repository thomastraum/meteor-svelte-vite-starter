<script>
  import { Meteor } from "meteor/meteor";
  import { UPLOAD_ROUTE } from "/imports/startup/both/";

  let { imageType, filename, _id } = $props();

  function deleteInput(id) {
    Meteor.call("inputs.remove", id);
  }
</script>

<div class="bg-white shadow-md rounded-lg p-4">
  <img
    src={`${UPLOAD_ROUTE}/${filename}`}
    alt={imageType}
    class="max-w-full h-auto"
  />
  <p class="p-5">{imageType}</p>

  <button
    on:click={deleteInput(_id)}
    class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
  >
    Delete
  </button>
</div>
