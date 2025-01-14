import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { routeStore } from "/imports/startup/client/routeStore";
import Home from "/imports/ui/pages/Home.svelte";
import WorkflowsPage from "/imports/ui/pages/WorkflowsPage.svelte";
import WorkflowPage from "/imports/ui/pages/WorkflowPage.svelte";
import RunsPage from "/imports/ui/pages/RunsPage.svelte";
import AddWorkflowPage from "/imports/ui/pages/AddWorkflowPage.svelte";
import InputsPage from "/imports/ui/pages/InputsPage.svelte";
import { currentRoute } from "/imports/ui/stores/stores";
import RendererPage from "/imports/ui/pages/RendererPage.svelte";
import SettingsPage from "/imports/ui/pages/SettingsPage.svelte";

// DISABLE QUERY STRING COMPATIBILITY
// WITH OLDER FlowRouter AND Meteor RELEASES
FlowRouter.decodeQueryParamsOnce = true;

// Add this global trigger
FlowRouter.triggers.enter([
  () => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    currentRoute.set(FlowRouter.current().route.name);
  },
]);

FlowRouter.route("/", {
  name: "home",
  action() {
    console.log("home");
    routeStore.set(Home);
  },
});

FlowRouter.route("/workflows/add", {
  name: "addWorkflow",
  action() {
    console.log("add workflow");
    routeStore.set(AddWorkflowPage);
  },
});

FlowRouter.route("/workflows/:id", {
  name: "workflowEdit",
  action(params) {
    console.log("workflow", params.id);
    routeStore.set(WorkflowPage);
  },
});

FlowRouter.route("/workflows", {
  name: "workflows",
  action() {
    console.log("workflows");
    routeStore.set(WorkflowsPage);
  },
});

FlowRouter.route("/runs", {
  name: "runs",
  action() {
    console.log("/runs");
    routeStore.set(RunsPage);
  },
});

FlowRouter.route("/inputs", {
  name: "inputs",
  action() {
    console.log("/inputs");
    routeStore.set(InputsPage);
  },
});

FlowRouter.route("/render/:id/:edit?", {
  name: "render",
  action(params) {
    // const isEditMode = params.edit === "edit";
    // console.log("/render", params.id, "edit mode:", isEditMode);
    routeStore.set(RendererPage);
  },
});

FlowRouter.route("/settings/", {
  name: "settings",
  action(params) {
    console.log("/settings");
    routeStore.set(SettingsPage);
  },
});
