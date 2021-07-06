window.addEventListener("load", () => {
  chrome.storage.local.get(null, (data) => {
    if (data) {
      document.addEventListener("mouseover", (event) => {
        const targetNode = event.target;
        if (targetNode.tagName === "A") {
          if (targetNode.href.indexOf("slack.com") > 0) {
            console.log("a slack link");
          }
        }
      });
    }
  });
});
