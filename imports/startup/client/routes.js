import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { setComponent } from "./routeManager";

// Import pages
import Home from "/imports/ui/pages/Home.svelte";
import WorkflowsPage from "/imports/ui/pages/WorkflowsPage.svelte";
import WorkflowPage from "/imports/ui/pages/WorkflowPage.svelte";
import RunsPage from "/imports/ui/pages/RunsPage.svelte";
import AddWorkflowPage from "/imports/ui/pages/AddWorkflowPage.svelte";
import InputsPage from "/imports/ui/pages/InputsPage.svelte";
import RendererPage from "/imports/ui/pages/RendererPage.svelte";
import SettingsPage from "/imports/ui/pages/SettingsPage.svelte";

// Enable modern query string handling
FlowRouter.decodeQueryParamsOnce = true;

// Global triggers
FlowRouter.triggers.enter([
  () => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }
]);

// Define routes
FlowRouter.route("/", {
  name: "home",
  action() {
    setComponent(Home);
  }
});

FlowRouter.route("/workflows", {
  name: "workflows",
  action() {
    setComponent(WorkflowsPage);
  }
});

FlowRouter.route("/workflows/add", {
  name: "addWorkflow", 
  action() {
    setComponent(AddWorkflowPage);
  }
});

FlowRouter.route("/workflows/:id", {
  name: "workflowEdit",
  action() {
    setComponent(WorkflowPage);
  }
});

FlowRouter.route("/runs", {
  name: "runs",
  action() {
    setComponent(RunsPage);
  }
});

FlowRouter.route("/inputs", {
  name: "inputs",
  action() {
    setComponent(InputsPage);
  }
});

FlowRouter.route("/render/:id/:edit?", {
  name: "render",
  action() {
    setComponent(RendererPage);
  }
});

FlowRouter.route("/settings", {
  name: "settings",
  action() {
    setComponent(SettingsPage);
  }
});
