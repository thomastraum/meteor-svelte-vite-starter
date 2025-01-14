<script>
  import { GENERATED_ROUTE } from "/imports/startup/both/";
  import RunInfo from "/imports/ui/components/common/RunInfo.svelte";
  let { run } = $props();
</script>

<img
  src={`${GENERATED_ROUTE}/${run.filename}`}
  loading="lazy"
  alt="Latest generated run"
  class="w-full h-auto rounded-md shadow-sm"
/>
<RunInfo {run} />
