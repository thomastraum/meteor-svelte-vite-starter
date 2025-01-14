/**
 * These modules are automatically imported by jorgenvatle:vite.
 * You can commit these to your project or move them elsewhere if you'd like,
 * but they must be imported somewhere in your Meteor mainModule.
 *
 * More info: https://github.com/JorgenVatle/meteor-vite#lazy-loaded-meteor-packages
 **/
import "../_vite-bundle/server/_entry.mjs"
/** End of vite auto-imports **/
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

