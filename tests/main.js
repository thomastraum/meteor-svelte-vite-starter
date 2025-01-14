import assert from "assert";
import { Meteor } from "meteor/meteor";

describe("simple-todos-svelte", () => {
  it("package.json has correct name", async () => {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "simple-todos-svelte");
  });

  if (Meteor.isClient) {
    it("client is not server", () => {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", () => {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
