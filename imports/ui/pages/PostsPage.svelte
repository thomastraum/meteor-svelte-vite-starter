<script>
  import { onDestroy } from "svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { usePosts } from "/imports/api/posts/posts.svelte.js";

  const postsManager = usePosts();
</script>

<h1>Posts</h1>
<div>
  {#if postsManager.isReady}
    <Button
      onclick={() => {
        postsManager.addPost("New post", "This is a new post");
      }}>Add a post</Button
    >
    there are {postsManager.posts.length}
    {postsManager.posts.length === 1 ? "post" : "posts"}
    {#each postsManager.posts as post}
      <div>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <Button
          onclick={() => {
            postsManager.deletePost(post._id);
          }}>Delete</Button
        >
      </div>
    {/each}
  {:else}
    <div>Loading...</div>
  {/if}
</div>
