import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { WorkflowsCollection } from "./collections";

Meteor.methods({
  async "workflows.remove"(workflowId) {
    check(workflowId, String);
    await WorkflowsCollection.removeAsync(workflowId);
  },
  "workflows.update"(workflowId, update) {
    console.log("updating workflow", workflowId);
    WorkflowsCollection.updateAsync(workflowId, { $set: update });
  },
  async "workflows.insert"({ name, workflow, nodeOrder }) {
    check(name, String);
    check(workflow, Object);
    check(nodeOrder, Array);
    // Validate JSON
    try {
      JSON.parse(JSON.stringify(workflow));
    } catch (e) {
      throw new Meteor.Error(
        "invalid-json",
        "The provided workflow is not valid JSON",
      );
    }

    const result = await WorkflowsCollection.insertAsync({
      name,
      workflow,
      createdAt: new Date(),
      nodeOrder,
    });
    
    return result; // This will be the _id of the newly inserted document
  },
  "workflows.getById"(workflowId) {
    return WorkflowsCollection.findOneAsync(workflowId);
  },
});
