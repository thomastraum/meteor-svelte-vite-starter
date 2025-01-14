<script>
  let { status } = $props();
</script>

<div class="flex flex-col items-center justify-center h-48 py4 px-3">
  <p class="text-gray-500 mt-2">{status}</p>
  <div class="flex justify-center items-center mt-4">
    <div
      class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
    ></div>
  </div>
</div>
