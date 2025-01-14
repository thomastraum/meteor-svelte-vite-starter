<script>
  import { Meteor } from "meteor/meteor";

  function copyUrl(event) {
    event.preventDefault();
    event.stopPropagation();
    const urlField = document.getElementById("uploadUrl");
    urlField.select();
    navigator.clipboard.writeText(urlField.value);
    // You might want to add some visual feedback here, like a temporary tooltip
  }
</script>

<div class="">
  <input
    type="text"
    value="{Meteor.absoluteUrl()}inputs/"
    readonly
    id="uploadUrl"
    class="border border-neutral-600 px-4 py-2 rounded text-small bg-inherit"
  />
  <button
    on:click={copyUrl}
    class="px-4 py-2 border border-neutral-600 hover:bg-neutral-600 rounded"
  >
    Copy URL
  </button>
</div>
