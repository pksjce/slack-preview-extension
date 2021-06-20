chrome.runtime.onInstalled.addListener(openTab);
chrome.action.onClicked.addListener(openTab);

function openTab() {
  chrome.tabs.create({ url: "popup.html" });
}

chrome.runtime.onMessage.addListener((param, _, sendResponse) => {
  if (param.type === "auth") {
    console.log("Event is recognised");
    sendResponse("Event is recognised");
  }
});
