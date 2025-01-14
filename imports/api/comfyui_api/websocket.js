import { Meteor } from "meteor/meteor";

if (Meteor.isServer) {
  import { Random } from "meteor/random";
  import { check } from "meteor/check";
  import { fetch } from "meteor/fetch";
  import { Log } from "meteor/logging";
  import WebSocket from "ws";
  // import fs from "fs/promises";
  const fs = require("fs");

  import path from "path";
  import sharp from "sharp";

  // Establish Connection
  const openWebsocketConnection = async () => {
    const { serverAddress } = Meteor.settings.private;
    const clientId = Random.id();
    const url = `ws://${serverAddress}/ws?clientId=${clientId}`;

    try {
      const ws = await new WebSocket(url);
      Log.info("WebSocket connection established successfully");

      ws.on("close", (code, reason) => {
        Log.info(`WebSocket disconnected. Code: ${code}, Reason: ${reason}`);
      });

      ws.on("error", (error) => {
        Log.error("WebSocket error:", error);
      });

      return { ws, serverAddress, clientId };
    } catch (error) {
      Log.error("WebSocket error:", error);
      throw new Meteor.Error(
        "websocket-connection-failed",
        "Failed to establish WebSocket connection",
      );
    }
  };
  // Basic API calls
  const queuePrompt = async (prompt, clientId, serverAddress) => {
    check(prompt, Object);
    check(clientId, String);
    check(serverAddress, String);

    const url = `http://${serverAddress}/prompt`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, client_id: clientId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Meteor.Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`,
        );
      }

      return await response.json();
    } catch (error) {
      Log.error("Error in queuePrompt:", error);
      throw error;
    }
  };

  const getHistory = async (promptId, serverAddress) => {
    check(promptId, String);
    check(serverAddress, String);

    const url = `http://${serverAddress}/history/${promptId}`;
    const response = await fetch(url);
    return response.json();
  };

  const getImage = async (filename, subfolder, folderType, serverAddress) => {
    check(filename, String);
    check(subfolder, String);
    check(folderType, String);
    check(serverAddress, String);

    const url = new URL(`http://${serverAddress}/view`);
    url.searchParams.append("filename", filename);
    url.searchParams.append("subfolder", subfolder);
    url.searchParams.append("type", folderType);

    const response = await fetch(url);
    return response.arrayBuffer();
  };

  // import fs from "fs";
  // import path from "path";
  // const { FormData } = require("formdata-node");
  // const { fileFromPath } = require("formdata-node/file-from-path");

  const uploadImage = async (
    pathToImage,
    filename,
    serverAddress,
    imageType = "input",
    overwrite = false,
  ) => {
    check(pathToImage, String);
    check(filename, String);
    check(serverAddress, String);
    check(imageType, String);
    check(overwrite, Boolean);

    // const { FormData } = require("formdata-node");
    // const { fileFromPath } = require("formdata-node/file-from-path");

    // const uploadUrl = `http://${serverAddress}/upload/image`;

    const uploadUrl = "http://localhost:8188/upload/image";

    console.log("uploadImage url:", uploadUrl);
    const form = new FormData();

    console.log("uploadImage pathToImage:", pathToImage);
    console.log("uploadImage filename:", filename);
    console.log("uploadImage imageType:", imageType);
    console.log("uploadImage overwrite:", overwrite);

    // const file = await fileFromPath(pathToImage);

    const fileBuffer = fs.readFileSync(pathToImage);

    form.append("image", new Blob([fileBuffer]), path.basename(pathToImage));
    form.append("type", "input"); // or 'output' or 'temp' based on your needs
    form.append("overwrite", "true");
    form.append("subfolder", ""); // Add a subfolder if needed

    try {
      // Send the POST request
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
  };

  // API helper functions
  const saveImage = async (images, outputPath, savePreviews) => {
    check(images, Array);
    check(outputPath, String);
    check(savePreviews, Boolean);

    const savePromises = images.map(async (item) => {
      const directory =
        item.type === "temp" && savePreviews
          ? path.join(outputPath, "temp")
          : outputPath;
      await fs.mkdir(directory, { recursive: true });

      const fullPath = path.join(directory, item.file_name);
      try {
        await sharp(item.image_data).toFile(fullPath);
        return { type: item.type, path: fullPath };
      } catch (error) {
        Log.error(`Failed to save image ${item.file_name}: ${error}`);
        return null;
      }
    });

    const savedImages = await Promise.all(savePromises);
    return savedImages;
  };

  const trackProgress = async (prompt, ws, promptId, progressCallback) => {
    check(prompt, Object);
    check(ws, WebSocket);
    check(promptId, String);
    check(progressCallback, Function);

    return new Promise((resolve) => {
      const nodeIds = Object.keys(prompt);
      const finishedNodes = new Set();

      ws.on("message", async (data) => {
        let message;
        try {
          message = JSON.parse(data);
        } catch (error) {
          Log.error("Error parsing WebSocket message:", error);
          return;
        }

        Log.info("Received message:", JSON.stringify(message));

        if (message.type === "progress") {
          const progress = Math.round(
            (message.data.value / message.data.max) * 100,
          );
          await progressCallback(progress);
          Log.info(
            `In K-Sampler -> Step: ${message.data.value} of: ${message.data.max}`,
          );
        } else if (message.type === "execution_start") {
          Log.info(`Execution started with prompt ${message.data.prompt_id}`);
        } else if (message.type === "executed") {
          Log.info(`Node ${message.data.node} executed`);
        } else if (
          message.type === "execution_cached" ||
          message.type === "executing"
        ) {
          if (Array.isArray(message.data.nodes)) {
            message.data.nodes.forEach((node) => {
              if (!finishedNodes.has(node)) {
                finishedNodes.add(node);
                const progress = Math.round(
                  (finishedNodes.size / nodeIds.length) * 100,
                );
                progressCallback(progress);
                Log.info(
                  `Progress: ${finishedNodes.size}/${nodeIds.length} Tasks done`,
                );
              }
            });
          } else {
            Log.info(`Executing node: ${message.data.node}`);
          }

          if (
            message.type === "executing" &&
            message.data.node === null &&
            message.data.prompt_id === promptId
          ) {
            Log.info("Execution completed");
            resolve();
          }
        }
      });
    });
  };

  const getImages = async (promptId, serverAddress, allowPreview = false) => {
    check(promptId, String);
    check(serverAddress, String);
    check(allowPreview, Boolean);

    const history = await getHistory(promptId, serverAddress);
    const imagePromises = [];
    for (const nodeId in history[promptId].outputs) {
      if (history[promptId].outputs.hasOwnProperty(nodeId)) {
        const nodeOutput = history[promptId].outputs[nodeId];
        if (nodeOutput.images) {
          for (const image of nodeOutput.images) {
            if (
              (allowPreview && image.type === "temp") ||
              image.type === "output"
            ) {
              imagePromises.push(
                getImage(
                  image.filename,
                  image.subfolder,
                  image.type,
                  serverAddress,
                ).then((imageData) => ({
                  image_data: imageData,
                  file_name: image.filename,
                  type: image.type,
                })),
              );
            }
          }
        }
      }
    }

    const outputImages = await Promise.all(imagePromises);
    return outputImages;
  };

  // Call API functions
  const generateImageByPromptAndImage = async (
    prompt,
    outputPath,
    inputPath,
    filename,
    savePreviews = false,
  ) => {
    check(prompt, Object);
    check(outputPath, String);
    check(inputPath, String);
    check(filename, String);
    check(savePreviews, Boolean);

    let ws;
    let serverAddress;
    let clientId;
    try {
      ({ ws, serverAddress, clientId } = await openWebsocketConnection());
      await uploadImage(inputPath, filename, serverAddress);
      const { prompt_id: promptId } = await queuePrompt(
        prompt,
        clientId,
        serverAddress,
      );
      await trackProgress(prompt, ws, promptId);
      const images = await getImages(promptId, serverAddress, savePreviews);
      const savedImages = await saveImage(images, outputPath, savePreviews);

      const mainImage = savedImages.find((img) => img && img.type === "output");

      if (mainImage) {
        return path.basename(mainImage.path);
      }
      throw new Error("No output image was generated");
    } finally {
      if (ws) ws.close();
    }
  };

  const promptToImage = async (
    workflow,
    positivePrompt,
    negativePrompt = "",
    savePreviews = false,
  ) => {
    check(workflow, String);
    check(positivePrompt, String);
    check(negativePrompt, String);
    check(savePreviews, Boolean);

    const prompt = JSON.parse(workflow);
    const idToClassType = Object.fromEntries(
      Object.entries(prompt).map(([id, details]) => [id, details.class_type]),
    );
    const kSampler = Object.keys(idToClassType).find(
      (key) => idToClassType[key] === "KSampler",
    );

    prompt[kSampler].inputs.seed = Random.integer(0, Number.MAX_SAFE_INTEGER);
    const positiveInputId = prompt[kSampler].inputs.positive[0];
    prompt[positiveInputId].inputs.text = positivePrompt;

    if (negativePrompt) {
      const negativeInputId = prompt[kSampler].inputs.negative[0];
      prompt[negativeInputId].inputs.text = negativePrompt;
    }

    return generateImageByPrompt(prompt, "./output/blog/cyborg", savePreviews);
  };

  const promptImageToImage = async (
    workflow,
    inputPath,
    positivePrompt,
    negativePrompt = "",
    savePreviews = false,
  ) => {
    check(workflow, String);
    check(inputPath, String);
    check(positivePrompt, String);
    check(negativePrompt, String);
    check(savePreviews, Boolean);

    const prompt = JSON.parse(workflow);
    const idToClassType = Object.fromEntries(
      Object.entries(prompt).map(([id, details]) => [id, details.class_type]),
    );
    const kSampler = Object.keys(idToClassType).find(
      (key) => idToClassType[key] === "KSampler",
    );

    prompt[kSampler].inputs.seed = Random.integer(0, Number.MAX_SAFE_INTEGER);
    const positiveInputId = prompt[kSampler].inputs.positive[0];
    prompt[positiveInputId].inputs.text = positivePrompt;

    if (negativePrompt) {
      const negativeInputId = prompt[kSampler].inputs.negative[0];
      prompt[negativeInputId].inputs.text = negativePrompt;
    }

    const imageLoader = Object.keys(idToClassType).find(
      (key) => idToClassType[key] === "LoadImage",
    );
    const filename = path.basename(inputPath);
    prompt[imageLoader].inputs.image = filename;

    return generateImageByPromptAndImage(
      prompt,
      "./output/blog/img2img",
      inputPath,
      filename,
      savePreviews,
    );
  };

  const generateImageByPrompt = async (
    prompt,
    outputPath,
    savePreviews = false,
  ) => {
    check(prompt, Object);
    check(outputPath, String);
    check(savePreviews, Boolean);

    let ws;
    let serverAddress;
    let clientId;
    try {
      ({ ws, serverAddress, clientId } = await openWebsocketConnection());
      const { prompt_id: promptId } = await queuePrompt(
        prompt,
        clientId,
        serverAddress,
      );
      await trackProgress(prompt, ws, promptId);
      const images = await getImages(promptId, serverAddress, savePreviews);
      const savedImages = await saveImage(images, outputPath, savePreviews);

      Log.info(`Images saved: ${JSON.stringify(savedImages)}`);

      const mainImage = savedImages.find((img) => img && img.type === "output");

      if (mainImage) {
        const imagePath = mainImage.path;
        const filename = path.basename(imagePath);
        const { width, height } = await sharp(imagePath).metadata();

        return {
          filename,
          path: imagePath,
          width,
          height,
        };
      }
      throw new Error("No output image was generated");
    } finally {
      if (ws) ws.close();
    }
  };

  export {
    openWebsocketConnection,
    queuePrompt,
    getHistory,
    getImage,
    uploadImage,
    promptToImage,
    promptImageToImage,
    generateImageByPrompt,
    generateImageByPromptAndImage,
    trackProgress,
    getImages,
    saveImage,
  };
}
