chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "NEW") newHighlight();
  if (message.action === "DELETE") deleteHighlight();
  sendResponse(`Processed: ${message.action}`);
});

const newHighlight = async () => {
  const selection = window.getSelection().toString();
  if (selection) {
    const span = document.createElement("span");
    span.style.backgroundColor = "yellow";
    span.style.color = "black";
    span.textContent = selection;
    span.classList.add(`highlighted-text`);
    const range = window.getSelection().getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);
  } else {
    alert("Please select text to highlight.");
  }
};

const deleteHighlight = async () => {
  const highlightedSpans = document.querySelectorAll(`span.highlighted-text`);
  highlightedSpans.forEach((span) => {
    const parent = span.parentNode;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
    parent.normalize();
  });
};
