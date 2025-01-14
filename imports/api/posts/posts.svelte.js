import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { Posts } from "./PostsCollection.js";

class PostsManager {

  isReady = $state(false);
  posts = $state([]);
  isSubmitting = $state(false);

  constructor() {
    // Create subscription
    this.subscription = Meteor.subscribe("posts.all");
    
    // Setup tracker
    this.computation = Tracker.autorun(() => {
      this.isReady = this.subscription.ready();
      console.log("isReady in class:", this.isReady);
      
      if (this.isReady) {
        this.posts = Posts.find({}, { sort: { createdAt: -1 } }).fetch();
      }
    });
  }

  async addPost(title, content) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    
    try {
      await Posts.insertAsync({ title, content, createdAt: new Date() });
    } catch (error) {
      console.error("Error adding post:", error);
      throw error;
    } finally {
      this.isSubmitting = false;
    }
  }

  async deletePost(postId) {
    const oldPosts = [...this.posts];
    this.posts = this.posts.filter(p => p._id !== postId);

    try {
      await Posts.removeAsync(postId);
    } catch (error) {
      this.posts = oldPosts;
      console.error("Error deleting post:", error);
      throw error;
    }
  }

  cleanup() {
    if (this.computation) {
      this.computation.stop();
    }
    if (this.subscription) {
      this.subscription.stop();
    }
  }
}

// Create a singleton instance
const postsManager = new PostsManager();

// Export a function that returns the singleton
export function usePosts() {
  return postsManager;
} 