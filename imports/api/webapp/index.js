// import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import { Log } from "meteor/logging";

import express from "express";
import multer from "multer";

import fs from "fs";
import path from "path";

import { InputsCollection } from "/imports/api/inputs/inputs";
import {
  UPLOAD_DIR,
  GENERATED_DIR,
  UPLOAD_ROUTE,
  GENERATED_ROUTE,
} from "/imports/startup/both/";

// const UPLOAD_DIR = path.join(Meteor.absolutePath, 'storage', 'uploads');
const router = express.Router();
const upload = multer({ dest: UPLOAD_DIR });

// Serve both directories
router.use(UPLOAD_ROUTE, express.static(UPLOAD_DIR));
router.use(GENERATED_ROUTE, express.static(GENERATED_DIR));

// Route to handle file uploads
router.post("/inputs", upload.single("uploaded-image"), async (req, res) => {
  console.log("req.body", req.body);
  const { file } = req;
  const imageType = req.body["image-type"];

  if (!file) {
    Log.error(`Missing file`);
    return res.status(400).json({ error: "Missing file" });
  }

  if (!imageType) {
    Log.error(`Missing imageType: ${JSON.stringify(req.body)}`);
    return res.status(400).json({ error: "Missing imageType" });
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "");
  const filename = path.format({
    name: `${path.parse(file.originalname).name}_${imageType}_${timestamp}`,
    ext: path.extname(file.originalname),
  });
  const filePath = path.join(UPLOAD_DIR, filename);

  // Move the file to the desired location
  fs.renameSync(file.path, filePath);

  // Insert new file metadata into the collection
  const input = await InputsCollection.insertAsync({
    filename,
    imageType,
    createdAt: new Date(),
  });

  Log.info(
    `new image ${input} with ${imageType} uploaded successfully. count: ${await InputsCollection.find({}).countAsync()}`,
  );

  return res.json({
    message: `Image of type ${imageType} uploaded successfully`,
  });
});

WebApp.connectHandlers.use(router);

/*

curl -X POST \
  "http://localhost:3000/inputs" \
  -H "Content-Type: multipart/form-data" \
  -F "image-type=beauty" \
  -F "uploaded-image=@./test.jpg"


  */
