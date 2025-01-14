
// const nodeInfoCache = new Map();

// async function getNodeInfo(nodeType) {
//     if (nodeInfoCache.has(nodeType)) {
//       return nodeInfoCache.get(nodeType);
//     }
  
//     try {
//         // https://tm-8-ubuntu.tail95eb8.ts.net
//       const response = await fetch(`https://${Meteor.settings.private.serverAddress}/object_info/${nodeType}`);
//       const info = await response.json();
//       nodeInfoCache.set(nodeType, info);
//       return info;
//     } catch (error) {
//       console.error(`Error fetching node info for ${nodeType}:`, error);
//       return null;
//   }
// }

// Meteor.methods({
//   getNodeInputs: async function (nodeType) {
//     const nodeInfo = await getNodeInfo(nodeType);
//     return nodeInfo
//   },
// });7
