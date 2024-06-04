async function getActiveTabURL() {
  const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true
  });

  return tabs[0];
}


const addNewHighlight = (highlights, highlight) => {
  const highlightTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newHighlightElement = document.createElement("div");

  highlightTitleElement.textContent = highlight.desc;
  highlightTitleElement.className = "highlighted-title";
  controlsElement.className = "highlight-controls";

  setHighlightsAttributes("mark", onMark, controlsElement);
  setHighlightsAttributes("delete", onDelete, controlsElement);

  newHighlightElement.id = "highlight-" + highlight.time+ "_" + highlight.url;
  newHighlightElement.className = "highlight";
  newHighlightElement.setAttribute("highlight_prop", highlight.time);

  newHighlightElement.appendChild(highlightTitleElement);
  newHighlightElement.appendChild(controlsElement);
  highlights.appendChild(newHighlightElement);
};

const viewHighlights = (currentHighlights=[]) => {
  const highlightsElement = document.getElementById("highlights");
  highlightsElement.innerHTML = "";

  if (currentHighlights.length > 0) {
    for (let i = 0; i < currentHighlights.length; i++) {
      const highlight = currentHighlights[i];
      addNewHighlight(highlightsElement, highlight);
    }
  } else {
    highlightsElement.innerHTML = '<i class="row">No Highlights to show</i>';
  }

  return;
};

const onMark = async e => {
  const highlight = e.target.parentNode.parentNode.getAttribute("highlight_prop");
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "MARK",
    value: highlight,
  });
};

const onDelete = async e => {
  const activeTab = await getActiveTabURL();
  const highlight = e.target.parentNode.parentNode.getAttribute("highlight_prop");
  const highlightElementToDelete = document.getElementById(
    "highlight-" + highlight
  );

  highlightElementToDelete.parentNode.removeChild(highlightElementToDelete);

  chrome.tabs.sendMessage(activeTab.id, {
    type: "DELETE",
    value: highlight,
  }, viewHighlights);
};

const setHighlightsAttributes =  (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("button");
  controlElement.value = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};
document.getElementsByClassName('add_highlight_btn')[0].addEventListener('click', async()=>{
  console.log("message sent");
    const activeTab = await getActiveTabURL();
    chrome.tabs.sendMessage(activeTab.id, {
      type:'NEW',
      url:activeTab.url
    })
})
document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const url = activeTab.url;

  const currentURL = url;

  if (currentURL) {
    chrome.storage.sync.get([currentURL], (data) => {
      const currentURLHighlights = data[currentURL] ? JSON.parse(data[currentURL]) : [];

      viewHighlights(currentURLHighlights);
    });
  }
});
