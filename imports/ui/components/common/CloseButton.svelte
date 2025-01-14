<script>
  export let onClose;
  export let size = 5;
  export let ariaLabel = 'Close';
</script>

<!-- X -->

<button
  on:click={onClose}
  class="text-gray-500 hover:text-gray-700 focus:outline-none"
  aria-label={ariaLabel}
>
  <svg
    class="w-{size} h-{size}"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M6 18L18 6M6 6l12 12"
    ></path>
  </svg>
</button>
