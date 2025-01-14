<script>
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  let { title, oninput } = $props();
</script>

<div class="">
  <!-- <Label for="node-name">Node name</Label> -->
  <Input
    id="node-name"
    type="text"
    placeholder="new node name"
    bind:value={title}
    {oninput}
    onfocus={() => {
      title = "";
    }}
  />
  <!-- <p class="text-muted-foreground text-sm">Enter your email address.</p> -->
</div>
