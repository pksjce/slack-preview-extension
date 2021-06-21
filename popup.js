const loginToSlack = document.getElementById("loginToSlack");
loginToSlack.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "oauth" }, (resp) => {
    console.log(resp);
  });
});
