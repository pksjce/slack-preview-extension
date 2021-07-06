const { WebClient } = require("@slack/web-api");

const getConversationDetails = async (params) => {
  const { token, oldest, cid } = params;
  const client = new WebClient(token);
  const results = await client.conversations.history({
    token,
    channel: cid,
    oldest,
    inclusive: true,
    limit: 1,
  });
  return results;
};

exports.handler = async (event, context) => {
  const token = event.queryStringParameters.token;
  const oldest = event.queryStringParameters.oldest;
  const cid = event.queryStringParameters.cid;
  const result = await getConversationDetails({ token, oldest, cid });
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
