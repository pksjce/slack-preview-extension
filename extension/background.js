const SLACK_OAUTH_AUTHORIZE_URL = "https://slack.com/oauth/v2/authorize";
const USER_SCOPE_PERMISSIONS = [
  "channels:read",
  "channels:history",
  "users:read"
];
const CLIENT_ID = "3012884836.2129586826388";
const CLIENT_SECRET = "9ddfbb74d856c301b6088f022e2f6185";

const slackUtils = {
  getOauthUrl: () => {
    const redirectUrl = chrome.identity.getRedirectURL();
    return `${SLACK_OAUTH_AUTHORIZE_URL}?user_scope=${USER_SCOPE_PERMISSIONS.join(
      ","
    )}&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}`;
  },
  getOauthAccessUrl: (codeUrl) => {
    const redirectUrl = chrome.identity.getRedirectURL();
    const [, search] = codeUrl.split("?");
    const [codeStr] = search.split("&");
    const [, code] = codeStr.split("=");
    const slackAccessUrl = `https://slack.com/api/oauth.v2.access?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${redirectUrl}&code=${code}`;
    return slackAccessUrl;
  }
};

chrome.runtime.onInstalled.addListener(openTab);
chrome.action.onClicked.addListener(openTab);

function openTab() {
  chrome.tabs.create({ url: "popup.html" });
}

chrome.runtime.onMessage.addListener((param, _, sendResponse) => {
  if (param.type === "oauth") {
    chrome.identity.launchWebAuthFlow(
      {
        url: slackUtils.getOauthUrl(),
        interactive: true
      },
      (codeUrl) => {
        fetch(slackUtils.getOauthAccessUrl(codeUrl))
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
            sendResponse(json);
          });
      }
    );
  }
  if (param.type === "getconvo") {
    const url = "http://localhost:9000/.netlify/functions/getSlackConvo/";
    const { cid, oldest, token } = param;
    const fullUrl =
      url +
      "?token=" +
      encodeURIComponent(token) +
      "&cid=" +
      encodeURIComponent(cid) +
      "&oldest=" +
      encodeURIComponent(oldest);
    fetch(fullUrl)
      .then((resp) => resp.json())
      .then((convo) => {
        sendResponse(convo);
      });
  }
  return true;
});
