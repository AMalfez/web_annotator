let Notes = [];
const ShowNotesToDOM = () => {
  console.log(Notes);
  const notes_container = document.getElementsByClassName(
    "highlights-container"
  )[0];
  if (Notes.length === 0) {
    notes_container.innerHTML = "<div><p>No notes to show.</p></div>";
    return;
  }
  notes_container.innerHTML = "";
  for (let i = 0; i < Notes.length; i++) {
    const note = Notes[i];
    console.log(note._id);
    let noteContainer = document.createElement("div");
    noteContainer.classList.add(`highlights`);
    // noteContainer.classList.add(`time_${note.time}`);
    noteContainer.setAttribute("id",`${note._id}`);
    // noteContainer.id = "highlights";
    const p = document.createElement("p");
    const innerText = TrimString(note.highlight+ " " + "-" + " " + note.note);
    const _ind = innerText.indexOf("-");
    p.innerHTML = _ind===-1 ? `<span style="font-weight: 600;">${innerText}</span>` : `<span style="font-weight: 600;">${innerText.split(" - ")[0]}</span><span> - ${innerText.split(" - ")[1]}</span>`;
    p.addEventListener("click",()=>{
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "SHOW_NOTE", highlight:note.highlight, note:note.note, _id:note._id },
          function (response) {
            if (!chrome.runtime.lastError) {
              console.log(response);
            } else {
              console.log(chrome.runtime.lastError, "error line 14");
            }
          }
        );
      });
    })
    const span = document.createElement("span");
    span.classList.add(`delete_note`);
    span.classList.add(`${note._id}`);
    span.innerText = "X";
    span.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "DELETE_NOTE", _id: note._id },
          function (response) {
            if (!chrome.runtime.lastError) {
              console.log(response);
            } else {
              console.log(chrome.runtime.lastError, "error line 14");
            }
          }
        );
      });
    });
    noteContainer.appendChild(p);
    noteContainer.appendChild(span);
    notes_container.appendChild(noteContainer);
  }
};
const fetchNotes = async () => {
  const data = await chrome.storage.sync.get("Notes");
  // console.log(data.Notes.Notes);
  if(data.Notes) Notes = [...Notes, ...data.Notes.Notes];
  ShowNotesToDOM();
  return;
};

const TrimString = (s)=>{
  if (s.length<50) {
    return s;
  }
  return s.slice(0,51)+"...";
}

document.addEventListener("DOMContentLoaded", () => {
  fetchNotes();
  const addBtn = document.getElementsByClassName("add_highlight_btn")[0];
  const removeBtn = document.getElementsByClassName("remove_highlight_btn")[0];
  const colorPicker = document.getElementById("colorPicker");
  const ExportBtn = document.getElementsByClassName("export_highlight_btn")[0];

  let highlightColor = "#ffff00";
  colorPicker.addEventListener("input", () => {
    highlightColor = colorPicker.value;
  });

  addBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "NEW", highlightColor },
        function (response) {
          if (!chrome.runtime.lastError) {
            console.log(response);
          } else {
            console.log(chrome.runtime.lastError, "error line 14");
          }
        }
      );
    });
  });

  removeBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "DELETE" },
        function (response) {
          if (!chrome.runtime.lastError) {
            console.log(response);
          } else {
            console.log(chrome.runtime.lastError, "error line 14");
          }
        }
      );
    });
    window.location.reload();
  });
});
