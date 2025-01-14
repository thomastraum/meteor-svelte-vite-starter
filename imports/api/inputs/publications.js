import { Meteor } from "meteor/meteor";
import { InputsCollection } from "/imports/api/inputs/inputs";

Meteor.publish("inputs.all", () => InputsCollection.find());
