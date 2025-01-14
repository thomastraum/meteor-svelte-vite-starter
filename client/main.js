import { Meteor } from "meteor/meteor";
import "./main.css";
import App from "/imports/ui/App.svelte";
// import { mount } from 'svelte'
// import { Router } from 'svelte5-router';



// import App from "./App.svelte";
import { mount } from "svelte";

Meteor.startup(() => {
  const app = mount(App, {
    target: document.getElementById("app"),
  });
});

