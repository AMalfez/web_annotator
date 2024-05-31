document.getElementById('highlight-button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: highlightSelection,
        args: [document.getElementById('note').value]
      });
    });
  });
  
  document.getElementById('remove-highlight-button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: removeHighlights
      });
    });
  });
  
  function highlightSelection(note) {
    const selection = window.getSelection().toString();
    if (selection) {
      const span = document.createElement('span');
      span.style.backgroundColor = 'yellow';
      span.style.color = 'black';
      span.textContent = selection;
      span.classList.add('highlighted-text');
      span.setAttribute('data-note', note);
  
      span.addEventListener('click', () => {
        alert(span.getAttribute('data-note'));
      });
  
      const range = window.getSelection().getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);
    } else {
      alert('Please select some text to highlight.');
    }
  }
  
  function removeHighlights() {
    const highlightedSpans = document.querySelectorAll('span.highlighted-text');
    highlightedSpans.forEach(span => {
      const parent = span.parentNode;
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      parent.removeChild(span);
      parent.normalize();
    });
  }
  