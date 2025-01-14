import { Meteor } from "meteor/meteor";
import { WorkflowsCollection } from "/imports/api/workflows/collections";

Meteor.publish("workflows.all", () => WorkflowsCollection.find());

// we dont want to publish the runs as it'll refresh the workflow we are working on
Meteor.publish("workflows.workflowOnly", () => {
  const options = {
    fields: { runs: 0 },
  };
  return WorkflowsCollection.find({}, options);
});
