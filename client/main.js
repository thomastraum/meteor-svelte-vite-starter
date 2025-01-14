
import { Meteor } from "meteor/meteor";
// import '/imports/startup/client/routes';
import "./main.css";
import App from "/imports/ui/App.svelte";
import { mount } from 'svelte'

Meteor.startup(() => {
  // new App({
  //   target: document.getElementById("app"),
  // });
  const app = mount(App, {
    target: document.getElementById('app'),
  })
  
});
