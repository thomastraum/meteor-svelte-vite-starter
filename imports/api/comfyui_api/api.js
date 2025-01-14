import { ComfyUIClient } from "comfy-ui-client";
import { Log } from "meteor/logging";

const { serverAddress } = Meteor.settings.private;
const clientId = "baadbabe-b00b-4206-9420-deadd00d1337";
export const comfyUIClient = new ComfyUIClient(serverAddress, clientId);

// Improved trackProgress function that calculates percentage
export const trackProgress = (progressCallback, errorCallback) => {
  const totalSteps = 0;
  const currentStep = 0;

  const messageHandler = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("WebSocket message received:", message);

      if (message.type === "progress") {
        const { value, max } = message.data;
        const progress = Math.round((value / max) * 100);
        progressCallback(progress, "processing");
        // Log.info(`Progress: ${value}/${max} (${progress}%)`);
      } else if (message.type === "executing") {
        progressCallback(0, "loading");
        Log.info(`Executing node: ${message.data.node}`);
      } else if (message.type === "execution_start") {
        progressCallback(0, "starting up...");
        Log.info(`Execution started: ${message.data.prompt_id}`);
      } else if (message.type === "executed") {
        progressCallback(100, "done!");
        Log.info(`Node executed: ${message.data.node}`);
      }
    } catch (error) {
      Log.error("Error parsing WebSocket message:", error);
      errorCallback(error);
    }
  };

  comfyUIClient.ws.addEventListener("message", messageHandler);

  // Return a function to remove the event listener when needed
  return () => {
    comfyUIClient.ws.removeEventListener("message", messageHandler);
  };
};
