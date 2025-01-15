<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Submitted");
  }
</script>

<form class="mt-6 flex w-full max-w-sm items-center space-x-2" onsubmit={handleSubmit}>
  <Input type="email" placeholder="email" />
  <Button type="submit">Search</Button>
</form>
