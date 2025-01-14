import { SettingsCollection } from "./collection";

Meteor.methods({
  async "settings.get"() {
    return await SettingsCollection.findOneAsync();
  },
  async "settings.update"(setting) {
    return await SettingsCollection.updateAsync({ _id: setting._id }, setting);
  },
});
