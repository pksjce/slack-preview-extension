const loginToSlack = document.getElementById("loginToSlack");
loginToSlack.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "auth" }, (resp) => {
    console.log(resp);
  });
});
