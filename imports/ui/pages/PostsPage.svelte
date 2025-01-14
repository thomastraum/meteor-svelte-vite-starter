<script>
    import { Meteor } from "meteor/meteor";
    import { Tracker } from "meteor/tracker";
    import { Posts } from "/imports/api/posts/PostsCollection.js";
    console.log("Posts");

    let postsSubs = Meteor.subscribe("posts.all");
  let subIsReady = $state(false);
  let posts = $state([]);
  let postsCount = $state(0);

  $effect.pre(() => {
    const computation = Tracker.autorun(() => {
      subIsReady = postsSubs.ready();
      if (subIsReady) {
        console.log("sub is ready, getting posts");
        posts = Posts.find({}, { sort: { createdAt: -1 } }).fetch();
      }
    });
    return () => {
      computation.stop();
    };
  });

</script>
<h1>Posts</h1>
<div>
    {#if subIsReady}
        {#each posts as post}
            <div>{post.title}</div>
        {/each}
    {:else}
        <div>Loading...</div>
    {/if}
</div>