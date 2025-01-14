<script>
  let { error } = $props();
</script>

<div
  class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
  role="alert"
>
  <p class="font-bold">Generation Failed</p>
  <p>{error || "An unknown error occurred"}</p>
</div>
