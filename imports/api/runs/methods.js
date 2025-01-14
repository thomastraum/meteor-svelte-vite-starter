import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Log } from "meteor/logging";
import { GENERATED_DIR, UPLOAD_DIR } from "/imports/startup/both/";
import { RunsCollection } from "/imports/api/runs/collections";
import { WorkflowsCollection } from "/imports/api/workflows/collections";
import { comfyUIClient, trackProgress } from "/imports/api/comfyui_api/api";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// this wont work for multiple images
function getImageFields(workflow) {
  const imageFields = [];
  for (const node of Object.values(workflow)) {
    if (node.class_type === "LoadImage") {
      imageFields.push(node.inputs.image);
    }
  }
  return imageFields;
}

Meteor.methods({
  async getLastFinishedRun(workflowId) {
    check(workflowId, String);
    return await RunsCollection.findOneAsync(
      { workflowId, status: { $eq: "finished" } },
      { sort: { createdAt: -1 }, fields: { _id: 1, filename: 1, createdAt:1 } },
    );
  },
  async getRun(runId) {
    check(runId, String);
    return await RunsCollection.findOneAsync(
      { _id: runId },
      { fields: { _id: 1, filename: 1 } },
    );
  },
  async newRun(workflowId, workflow) {
    check(workflowId, String);
    check(workflow, Object);
    const runId = await RunsCollection.insertAsync({
      workflowId,
      workflow,
      createdAt: new Date(),
      status: "starting",
      progress: 0,
      runtime: 0,
    });

    const workflowReturn = await WorkflowsCollection.upsertAsync(
      { _id: workflowId },
      { $push: { runs: runId } },
    );

    try {
      if (!comfyUIClient.ws) {
        await comfyUIClient.connect();
        // throw new Meteor.Error(
        //   "comfyui-not-connected",
        //   "ComfyUI is not connected",
        // );
      }

      Log.info(`Starting run ${comfyUIClient.ws}`);
      const start = new Date();

      // get image names from workflow
      const imageNames = getImageFields(workflow);
      // upload images to comfyui
      const uploadPromises = imageNames.map(async (imageName) => {
        const imageBuffer = fs.readFileSync(`${UPLOAD_DIR}/${imageName}`);
        return comfyUIClient.uploadImage(imageBuffer, imageName, true);
      });
      await Promise.all(uploadPromises);

      // Start tracking progress
      const stopTracking = trackProgress(
        async (progress, status) => {
          await RunsCollection.updateAsync(runId, {
            $set: { progress, status },
          });
        },
        async (error) => {
          await RunsCollection.updateAsync(runId, {
            $set: { status: "error", error: error.message },
          });
          throw error;
        },
      );

      // queue prompt Get images (this will queue the prompt and wait for the workflow to complete)
      const images = await comfyUIClient.getImages(workflow);

      // Stop tracking progress
      stopTracking();

      // Extract filename(s) from the images object
      const filenames = Object.values(images).flatMap((imageArray) =>
        imageArray.map((item) => item.image?.filename).filter(Boolean),
      );

      await comfyUIClient.saveImages(images, GENERATED_DIR, false);

      // Use the first filename (if available) for further processing
      const mainImageFilename = filenames[0];
      if (mainImageFilename) {
        const mainImagePath = path.join(GENERATED_DIR, mainImageFilename);
        const { width, height } = await sharp(mainImagePath).metadata();

        const runFinished = await RunsCollection.upsertAsync(
          { _id: runId },
          {
            $set: {
              filename: mainImageFilename,
              path: mainImagePath,
              width,
              height,
              status: "finished",
              progress: 100,
              runtime: new Date().getTime() - start.getTime(),
            },
          },
          {
            returnNewDocument: true,
            fields: { filename: 1, _id: 1, width: 1, height: 1 },
          },
        );
        return runFinished;
      }

      throw new Error("No output image was generated");
    } catch (error) {
      Log.error(`Error in generateImage method: ${error.message}`);

      await RunsCollection.upsertAsync(runId, {
        $set: {
          error: error.message,
          status: "failed",
          progress: 0,
        },
      });
      throw new Meteor.Error(
        "generate-image-failed",
        "Failed to generate image",
        error,
      );
    }
  },
});
