async function getActiveTabURL() {
  const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true
  });

  return tabs[0];
}


let currentURL = "";
let currentHighlights = [];
let currentHighlightTime = "";

const getTime = (t) => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString();
};

const fetchHighlights = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([currentURL], (obj) => {
      resolve(obj[currentURL] ? JSON.parse(obj[currentURL]) : []);
    });
  });
};

const newHighlight = async () => {
  console.log('i listened');
  const date = new Date();
  const highlightExists = document.getElementsByClassName(
    `highlight-${currentURL}_${date.getMilliseconds()}`
  )[0];
  const selection = window.getSelection().toString();
  currentHighlights = await fetchHighlights();

  if (!highlightExists && selection) {
    const span = document.createElement("span");
    span.style.backgroundColor = "yellow";
    span.style.color = "black";
    span.textContent = selection;
    span.classList.add(`highlight-${currentURL}_${date.getMilliseconds()}`);
    const range = window.getSelection().getRangeAt(0);
    // console.log(window.getSelection().focusNode.parentElement.classList);
    range.deleteContents();
    range.insertNode(span);
    currentHighlightTime = date;

    addNewHighlightEventHandler();
  }
};

const addNewHighlightEventHandler = async () => {
  const currentTime = currentHighlightTime;
  const newHighlight = {
    id: `${currentURL}_${currentTime.getMilliseconds()}`,
    time: currentTime,
    url: currentURL,
    desc: "Highlight on " + getTime(currentTime),
  };

  currentHighlights = await fetchHighlights();

  chrome.storage.sync.set({
    [currentVideo]: JSON.stringify([...currentHighlights, newHighlight]),
  });
};

chrome.runtime.onMessage.addListener((obj, sender, response) => {
  const { type, value, url } = obj;

  if (type === "NEW") {
    currentURL = url;
    newHighlight();
  } else if (type === "MARK") {
    currentHighlightTime = value;
  } else if (type === "DELETE") {
    currentHighlights = currentHighlights.filter((b) => b.time != value);
    chrome.storage.sync.set({
      [currentURL]: JSON.stringify(currentHighlights),
    });
    //logic to remove highlight

    response(currentHighlights);
  }
});

newHighlight()
