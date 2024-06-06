chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId },
        files: ["./contentScript.js"],
      })
      .then(() => {
        console.log("we have injected the content script");
      })
      .catch((err) => console.log(err, "error in background script line 10"));

    chrome.tabs.sendMessage(
      tabId,
      { action: "URL", url: tab.url },
      function (response) {
        if (!chrome.runtime.lastError) {
          console.log(response);
        } else {
          console.log(chrome.runtime.lastError, "error line 14");
        }
      }
    );
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  if (activeInfo.tabId) {
    chrome.tabs.sendMessage(activeInfo.tabId, { updateStorage: true });
  }
})
