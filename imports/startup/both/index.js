import { Meteor } from 'meteor/meteor';
import path from 'path';

// Helper function to create directory if it doesn't exist (server-side only)
const ensureDir = (dir) => {
  if (Meteor.isServer) {
    const fs = require('fs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  return dir;
};

// Function to create and return path configurations
const createPathConfig = (baseDir) => {
  const config = {
    UPLOAD_ROUTE: '/uploads',
    GENERATED_ROUTE: '/generated',
  };

  if (Meteor.isServer) {
    const storageDir = ensureDir(path.join(baseDir, 'storage'));
    const uploadDir = ensureDir(path.join(storageDir, 'uploads'));
    const generatedDir = ensureDir(path.join(storageDir, 'generated'));

    Object.assign(config, {
      STORAGE_DIR: storageDir,
      UPLOAD_DIR: uploadDir,
      GENERATED_DIR: generatedDir,
    });
  } else {
    Object.assign(config, {
      STORAGE_DIR: '/storage',
      UPLOAD_DIR: '/storage/uploads',
      GENERATED_DIR: '/storage/generated',
    });
  }

  return config;
};

// Default configuration
export const defaultConfig = createPathConfig(Meteor.isServer ? Meteor.absolutePath : undefined);

// Destructure for easier import
export const {
  STORAGE_DIR,
  UPLOAD_DIR,
  GENERATED_DIR,
  UPLOAD_ROUTE,
  GENERATED_ROUTE,
} = defaultConfig;