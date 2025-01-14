<script>
  let { progress, status } = $props();
</script>

<div class="flex flex-col items-center justify-center h-48 py4 px-3">
  <p class="text-gray-500 mt-2">{status}</p>
  <div class="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700">
    <div
      class="bg-blue-600 h-2.5 rounded-full"
      style="width: {progress}%"
    ></div>
  </div>
  <p class="text-gray-500 mt-2">{progress}%</p>
</div>
