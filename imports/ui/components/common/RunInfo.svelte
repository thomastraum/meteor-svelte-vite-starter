<script>
  import { Meteor } from "meteor/meteor";
  import { RunsCollection } from "/imports/api/runs/collections";
  import { GENERATED_ROUTE } from "/imports/startup/both/";
  import { formatDate, formatRuntime } from "/imports/ui/helpers/helpers";

  export let run;

  // /* eslint-disable no-labels  */
  // /* eslint-disable no-unused-labels */
  // $m: handle = Meteor.subscribe("runs.all");
  // $m: subIsReady = handle.ready();
  // $m: runs = RunsCollection.find({}, { sort: { createdAt: -1 } }).fetch();
  // $m: lastRun = RunsCollection.findOne({}, { sort: { createdAt: -1 } });
</script>

<section class="mt-2 text-sm text-neutral-600 font-bold">
  <!-- <p>Filename: {run.filename}</p> -->
  <!-- <p>Dimensions: {run.width}x{run.height}</p> -->
  <p>
    Rendered {formatDate(run.createdAt)} in {formatRuntime(run.runtime)}
  </p>
</section>
