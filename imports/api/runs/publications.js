import { Meteor } from "meteor/meteor";
import { RunsCollection } from "/imports/api/runs/collections";

Meteor.publish("runs.all", () => RunsCollection.find());
