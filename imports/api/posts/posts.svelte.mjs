import { Meteor } from "meteor/meteor";
import { Posts } from "./PostsCollection.js";
// import { $state, $effect } from "svelte";

export function usePosts() {
  const subscription = Meteor.subscribe("posts.all");
  const isReady = $state(false);
  const posts = $state([]);
  const isSubmitting = $state(false);

  $effect.pre(() => {
    const computation = Tracker.autorun(() => {
      isReady = subscription.ready();
      if (isReady) {
        posts = Posts.find({}, { sort: { createdAt: -1 } }).fetch();
      }
    });
    return () => computation.stop();
  });

  async function addPost(title, content) {
    if (isSubmitting) return;
    isSubmitting = true;
    
    try {
      await Posts.insertAsync({ title, content, createdAt: new Date() });
    } catch (error) {
      console.error("Error adding post:", error);
      throw error;
    } finally {
      isSubmitting = false;
    }
  }

  async function deletePost(postId) {
    const oldPosts = [...posts];
    posts = posts.filter(p => p._id !== postId);

    try {
      await Posts.removeAsync(postId);
    } catch (error) {
      posts = oldPosts;
      console.error("Error deleting post:", error);
      throw error;
    }
  }

  return {
    posts,
    isReady,
    isSubmitting,
    addPost,
    deletePost
  };
} 