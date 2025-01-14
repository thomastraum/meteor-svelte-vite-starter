import { Mongo } from 'meteor/mongo';
import { NodeInfoCollection } from "./collection"
import { getNodeInfoFromComfyUI } from "./nodeinfoapi";

Meteor.publish("nodeInfo.all", () => NodeInfoCollection.find());
Meteor.publish("nodeInfo.name", async (name) => {
    const exists = await NodeInfoCollection.find({name:name}).countAsync();
    if (exists){
        return NodeInfoCollection.find({name:name});
    } else {
        console.log("nodeInfo not found, fetching from server");
        const nodeInfo = await getNodeInfoFromComfyUI(name);
        await NodeInfoCollection.insertAsync(nodeInfo[name]);
        return NodeInfoCollection.find({name:name});
    }
});