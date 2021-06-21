const SLACK_OAUTH_AUTHORIZE_URL = "https://slack.com/oauth/v2/authorize";
const USER_SCOPE_PERMISSIONS = [
  "channels:read",
  "channels:history",
  "users:read",
];
const CLIENT_ID = "3012884836.2129586826388";
const CLIENT_SECRET = "224b3289623721fab1fa849e1c9bd2b7";

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
  },
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
        interactive: true,
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
  return true;
});
