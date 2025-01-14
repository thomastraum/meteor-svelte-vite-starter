import { Meteor } from "meteor/meteor";
import { Posts } from "./PostsCollection.js";

Meteor.publish("posts.all", function () {
  
  console.log("Publication being called");
  return Posts.find();
});
