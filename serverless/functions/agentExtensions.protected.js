exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  const agentExt = event.agentExt;
  const assetPath = process.env.TWILIO_ASSET_NAME;
  const getData = Runtime.getAssets()[assetPath].open;
  const data = JSON.parse(getData());

  response.appendHeader('Content-Type', 'application/json');

  try {
    const extensionNumber = data.find(
      item => item.extensionNumber === agentExt
    );

    if (extensionNumber === undefined) {
      console.log(`Agent extension ${agentExt} not found.`);
      return callback(null, response);
    }

    console.log(`Found a match!`);
    response.setBody({ workerSID: extensionNumber.workerSid });
    return callback(null, response);
  } catch (error) {
    console.error(error);
  }
};
