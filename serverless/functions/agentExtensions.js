exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  const agentExt = event.agentExt;
  const syncMapService = context.TWILIO_SYNC_SERVICE_SID;
  const syncMapSid = context.TWILIO_SYNC_MAP_SID;
  const client = context.getTwilioClient();

  try {
    const syncMap = await client.sync
      .services(syncMapService)
      .syncMaps(syncMapSid)
      .syncMapItems.list();

    const extensionNumber = syncMap.find(syncMapItem => {
      if (agentExt === syncMapItem.data.extensionNumber) {
        console.log(`Found a match!`);
        return syncMapItem;
      } else {
        console.log(`Agent extension ${agentExt} not found.`);
      }
    });

    response.appendHeader('Content-Type', 'application/json');
    response.setBody({ workerSID: extensionNumber.data.workerSid });

    return callback(null, response);
  } catch (error) {
    console.error(error);
  }
};
