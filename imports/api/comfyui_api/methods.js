import { Meteor } from 'meteor/meteor';
import { comfyUIClient } from "./api";


Meteor.methods({
  async 'api.getStatus'() {
    this.unblock(); // Allow other method calls to run
    
    console.log("adsadadsdad", comfyUIClient.ws.readyState)
    if (comfyUIClient.ws && comfyUIClient.ws.readyState === 1) {
      return true; // Already connected
    }
    
    // Try to connect if not already connected
    return connectComfyUI();
  }
});
