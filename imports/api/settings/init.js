import { SettingsCollection } from "./collection";


export const initializeSettings = async () => {
  const settingsCount  = await SettingsCollection.find().countAsync();
  if (settingsCount > 0) {
    return;
  }
  await SettingsCollection.insertAsync({
    settings: {
      serverAddress: "localhost:8188",
    },
  });
};
