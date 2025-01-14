import { Meteor } from "meteor/meteor";
import { Posts } from "./PostsCollection.js";

Meteor.publish("posts.all", function () {
  return Posts.find();
});
