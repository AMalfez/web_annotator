(() => {
  let currentNotes = [];
  let selection="";
  let time="";
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "NEW") {
      newHighlight(message.highlightColor, message.textColor);
    }
    // if (message.action === "URL") window.alert(message.url);
    if (message.action === "DELETE") deleteHighlight();
    if (message.action === "DELETE_NOTE"){
      time = ""+message.time;
      deleteNote();
    }
    // console.log(currentNotes);
    sendResponse("request processed");
  });

  const updateStorage = ()=>{
    const url = window.location.href;
    const Notes = {Notes:currentNotes};
    chrome.storage.sync.set({Notes});
  }

  const showNoteInput = () => {
    let NoteInput = document.getElementsByClassName(
      "highlighted-note-input"
    )[0];
    const note = document.getElementsByClassName(
      "highlighted-note-modal-container"
    )[0];
    if (!NoteInput) {
      NoteInput = document.createElement("div");
      NoteInput.classList.add("highlighted-note-input");
      NoteInput.style.width = "40%";
      NoteInput.style.height = "fit-content";
      NoteInput.style.padding = "20px 30px 30px 30px";
      NoteInput.style.display = "flex";
      NoteInput.style.flexDirection = "column";
      NoteInput.style.backgroundColor = "white";
      NoteInput.style.margin = "auto";
      NoteInput.style.position = "relative";

      const closeIcon = document.createElement("p");
      closeIcon.innerText = "x";
      closeIcon.style.position = "absolute";
      closeIcon.style.top = "0";
      closeIcon.style.left = "20px";
      closeIcon.style.cursor = "pointer";
      closeIcon.addEventListener("click", () => {
        NoteInput.style.display="none";
        note.style.display = "none";
      });

      const title = document.createElement("p");
      title.classList.add("add-a-note-title");
      title.innerText = "Add a note";
      title.style.textAlign = "center";
      title.style.fontSize = "20px";
      title.style.fontWeight = "600";
      title.style.marginBottom = "10px";

      const input = document.createElement("input");
      input.id = "highlighted-input-form";
      input.name = "highlighted-input-form";
      input.placeholder = "Type in your note";
      input.style.outline = "none";
      input.style.padding = "10px 8px";
      input.style.borderTop = "none";
      input.style.borderRight = "none";
      input.style.borderLeft = "none";
      input.style.borderBottom = "1ps solid lightgrey";
      input.style.backgroundColor = "white";

      const inputBtn = document.createElement("button");
      inputBtn.value = "Add a note";
      inputBtn.innerText = "Add a note";
      inputBtn.style.marginTop = "10px";
      inputBtn.style.backgroundColor = "#6fd673";
      inputBtn.style.color = "white";
      inputBtn.style.cursor = "pointer";
      inputBtn.style.padding = "10px 5px";
      inputBtn.style.border = "none";
      inputBtn.addEventListener("click", () => {
        const date = new Date();
        currentNotes.push({note: `${input.value}`, time: date.getMilliseconds(), highlight:selection});
        console.log(currentNotes);
        updateStorage();
        input.value = "";
        NoteInput.style.display = 'none';
        note.style.display = "none";
      });

      NoteInput.appendChild(closeIcon);
      NoteInput.appendChild(title);
      NoteInput.appendChild(input);
      NoteInput.appendChild(inputBtn);
      note.appendChild(NoteInput);
    }else NoteInput.style.display = 'flex';
  };

  const showNoteModal = (s) => {
    let note = document.getElementsByClassName(
      "highlighted-note-modal-container"
    )[0];
    if (note) {
      note.style.display = "flex";
    } else if (!note) {
      note = document.createElement("div");
      note.style.display = "flex";
      note.style.width = "100%";
      note.style.height = "100%";
      note.style.backgroundColor = "rgba(0,0,0,0.4)";
      note.style.position = "fixed";
      note.style.zIndex = "1000";
      note.style.top = "0";
      note.style.left = "0";
      note.style.right = "0";
      note.style.bottom = "0";
      note.style.justifyContent = "center";
      note.style.alignItem = "center";
      note.classList.add("highlighted-note-modal-container");
      document.body.appendChild(note);
    }
    if (s == "new_note") showNoteInput();
    if (s == "ask_to_delete") AskToDelete();
  };
  const newHighlight = async (color, textColor) => {
    selection = window.getSelection().toString();
    if (selection) {
      showNoteModal("new_note");
      const span = document.createElement("span");
      span.style.backgroundColor = color;
      span.style.color = textColor;
      span.textContent = selection;
      span.classList.add(`highlighted-text`);
      span.addEventListener("click", () => {
        showNoteModal();
      });
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
    currentNotes=[];
    updateStorage();
    window.location.reload();
  };

  const AskToDelete = () => {
    let ask = document.getElementsByClassName(
      "highlighted-delete-permission"
    )[0];
    let note = document.getElementsByClassName(
      "highlighted-note-modal-container"
    )[0];
    if (!ask) {
      ask = document.createElement("div");
      ask.classList.add("highlighted-delete-permission");
      ask.style.width = "40%";
      ask.style.height = "fit-content";
      ask.style.padding = "20px 30px 30px 30px";
      ask.style.display = "flex";
      ask.style.flexDirection = "column";
      ask.style.backgroundColor = "white";
      ask.style.margin = "auto";

      const title = document.createElement("p");
      title.classList.add("are-you-sure-to-delete-highlight");
      title.innerText =
        "Are you sure you want to delete this highlight permanently ?";
      title.style.textAlign = "center";
      title.style.fontSize = "20px";
      title.style.fontWeight = "500";
      title.style.marginBottom = "10px";

      const BtnElem = document.createElement("div");
      BtnElem.classList.add("delete-highlight-btns");
      BtnElem.style.width = "100%";
      BtnElem.style.display = "flex";
      BtnElem.style.alignContent = "center";
      BtnElem.style.paddingTop = "10px";
      BtnElem.style.borderTop = "1px solid lightgray";
      BtnElem.style.justifyContent = "space-between";

      const Confirm = document.createElement("button");
      Confirm.innerText = "Confirm";
      Confirm.style.backgroundColor = "#6fd673";
      Confirm.style.color = "white";
      Confirm.style.cursor = "pointer";
      Confirm.style.padding = "10px 5px";
      Confirm.style.border = "none";
      Confirm.addEventListener("click", () => {
        note.style.display = "none";
        ask.style.display = "none";
        currentNotes = currentNotes.filter((n)=> n.time != time)
        updateStorage();
      });
      Confirm.style.flex = "0.45";

      const Cancel = document.createElement("button");
      Cancel.innerText = "Cancel";
      Cancel.style.backgroundColor = "red";
      Cancel.style.color = "white";
      Cancel.style.cursor = "pointer";
      Cancel.style.padding = "10px 5px";
      Cancel.style.border = "none";
      Cancel.addEventListener("click", () => {
        note.style.display = "none";
        ask.style.display = 'none';
      });
      Cancel.style.flex = "0.45";

      BtnElem.appendChild(Confirm);
      BtnElem.appendChild(Cancel);
      ask.appendChild(title);
      ask.appendChild(BtnElem);
      note.appendChild(ask);
    }else ask.style.display = 'flex';
  };

  const deleteNote = () => {
    showNoteModal("ask_to_delete");
  };
})();
