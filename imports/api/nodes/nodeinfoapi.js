import { NodeInfoCollection } from "./collection";
import { fetch } from "meteor/fetch";

export async function initializeNodeInfo(nodename, nodeInfo){
  const exists = await NodeInfoCollection.find({name:nodename}).countAsync();
  if ( !exists ){
    console.log(nodename, nodeInfo)
    if (nodeInfo[nodename]) {
        const _id = await NodeInfoCollection.insertAsync(nodeInfo[nodename])
        console.log(_id)
    } else {
        throw Error(`cant find ${nodename} in ${nodeInfo}`);
    }   
  }
}

export async function getNodeInfoFromComfyUI(nodename){
  console.log("fetching nodeInfo from server", nodename);
  const url = `https://${Meteor.settings.private.serverAddress}/object_info/${nodename}`;
  console.log("url", url);
  const response = await fetch(url);
  // console.log(response)
  const nodeInfo = await response.json();
  console.log(`${nodename} not found, fetched from server and inserted`);
  console.log(nodeInfo)
  return nodeInfo;
}