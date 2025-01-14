import { Meteor } from "meteor/meteor";
import "../imports/startup/both";
import "../imports/startup/server";
import { Posts } from "../imports/api/posts/PostsCollection.js";

Meteor.startup(async () => {
  if (await Posts.find().countAsync() === 0) {
    await Posts.insertAsync({
      title: "Hello World",
      content: "This is a test post",
    });
  }
});

