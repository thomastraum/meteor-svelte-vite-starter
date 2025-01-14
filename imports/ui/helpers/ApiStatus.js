import { writable } from 'svelte/store';
import { Tracker } from 'meteor/tracker';
// import { comfyUIClient } from "/imports/api/comfyui_api/api";

export const comfyUIConnectionStatus = writable('disconnected');

if (Meteor.isClient) {
  Tracker.autorun(async () => {
    comfyUIConnectionStatus.set(await Meteor.callAsync('api.getStatus'));
  });
} 