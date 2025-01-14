<script>
  import { Meteor } from "meteor/meteor";
  import { Tracker } from "meteor/tracker";
  import { Posts } from "/imports/api/posts/PostsCollection.js";

  import Button from "$lib/components/ui/button/button.svelte";

  let postsSubs = Meteor.subscribe("posts.all");
  let subIsReady = $state(false);
  let posts = $state([]);
  let postsCount = $state(0);

  $effect.pre(() => {
    const computation = Tracker.autorun(() => {
      subIsReady = postsSubs.ready();
      if (subIsReady) {
        posts = Posts.find({}, { sort: { createdAt: -1 } }).fetch();
      }
    });
    return () => {
      computation.stop();
    };
  });

  async function addPost() {
    const newPost = {
      title: `post ${posts.length + 1}`,
      content: "Content of the new post",
      createdAt: new Date(),
    };

    try {
      await Posts.insertAsync(newPost);
      console.log("Post added successfully!");
    } catch (error) {
      console.error("Error adding post:", error);
    }
  }

  async function deletePost(postId) {
    try {
      await Posts.removeAsync(postId);
      console.log("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }
</script>

<h1>Posts</h1>
<div>
  {#if subIsReady}
    <Button
      onclick={() => {
        addPost();
      }}>Add a post</Button
    >
    there are {posts.length}
    {posts.length === 1 ? "post" : "posts"}
    {#each posts as post}
      <div>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <Button
          onclick={() => {
            deletePost(post._id);
          }}>Delete</Button
        >
      </div>
    {/each}
  {:else}
    <div>Loading...</div>
  {/if}
</div>
