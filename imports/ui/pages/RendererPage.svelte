<script>
  import Runs from "/imports/ui/features/Runs.svelte";
  import Workflows from "/imports/ui/features/Workflows.svelte";
  // import { routeParams } from "/imports/startup/client/routeParamsStore";
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div class="col-span-1">
    <!-- <div class=""> -->
    <Workflows />
    <!-- </div> -->
  </div>
  <div class="col-span-1">
    <Runs />
  </div>
</div>

<style>
  /* Webkit browsers (Chrome, Safari, newer versions of Edge) */
  .scrollbar::-webkit-scrollbar {
    width: 8px; /* width of vertical scrollbar */
    height: 8px; /* height of horizontal scrollbar */
  }

  .scrollbar::-webkit-scrollbar-track {
    background: #1f1f1f; /* dark background */
    border-radius: 4px;
  }

  .scrollbar::-webkit-scrollbar-thumb {
    background: #4b4b4b; /* scrollbar color */
    border-radius: 4px;
  }

  .scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555555; /* scrollbar hover color */
  }

  /* Firefox */
  .scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #4b4b4b #1f1f1f; /* thumb and track color */
  }
</style>
