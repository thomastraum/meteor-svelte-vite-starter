import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { InputsCollection } from "/imports/api/inputs/inputs";

Meteor.methods({
  async "inputs.remove"(_id) {
    check(_id, String);
    InputsCollection.remove(_id);
  },
});
