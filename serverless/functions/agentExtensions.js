exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  const agentExt = event.agentExt;
  const syncMapService = context.TWILIO_SYNC_SERVICE_SID;
  const syncMapSid = context.TWILIO_SYNC_MAP_SID;
  const client = context.getTwilioClient();
  response.appendHeader('Content-Type', 'application/json');

  try {
    const syncMap = await client.sync
      .services(syncMapService)
      .syncMaps(syncMapSid)
      .syncMapItems.list();

    const extensionNumber = syncMap.find(syncMapItem => syncMapItem.data.extensionNumber === agentExt);
    response.setBody({ workerSID: extensionNumber.data.workerSid });

    if (agentExt === extensionNumber.data.extensionNumber) {
      console.log(`Found a match!`);
      return callback(null, response);
    } else {
      console.log(`Agent extension ${agentExt} not found.`);
      return callback(null, response);
    }
  } catch (error) {
    console.error(error);
  }
};
