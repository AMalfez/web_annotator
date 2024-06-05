chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "NEW") newHighlight(message.highlightColor, message.textColor);
  if (message.action === "DELETE") deleteHighlight();
  sendResponse(`Processed: ${message.action}`);
});

const showNoteInput = ()=>{
  let NoteInput = document.getElementsByClassName('highlighted-note-input')[0];
  const note = document.getElementsByClassName('highlighted-note-modal-container')[0];
  if(!NoteInput){
    NoteInput = document.createElement('div');
    NoteInput.classList.add('highlighted-note-input');
    NoteInput.style.width = '40%';
    NoteInput.style.height = 'fit-content';
    NoteInput.style.padding = '20px 30px 30px 30px';
    NoteInput.style.display = 'flex';
    NoteInput.style.flexDirection = 'column';
    NoteInput.style.backgroundColor = 'white';
    NoteInput.style.margin='auto';

    const title = document.createElement('p');
    title.classList.add('add-a-note-title');
    title.innerText = "Add a note"
    title.style.textAlign = 'center';
    title.style.fontSize = '20px';
    title.style.fontWeight = '600';
    title.style.marginBottom = '10px';

    const input = document.createElement('input');
    input.id = "highlighted-input-form";
    input.name = "highlighted-input-form";
    input.placeholder = "Type in your note";
    input.style.outline = 'none';
    input.style.padding = "10px 8px";
    input.style.borderTop = 'none';
    input.style.borderRight = 'none';
    input.style.borderLeft = 'none';
    input.style.borderBottom = '1ps solid lightgrey';
    input.style.backgroundColor = 'white';

    const inputBtn = document.createElement('button');
    inputBtn.value = "Add a note";
    inputBtn.innerText = "Add a note";
    inputBtn.style.marginTop = '10px';
    inputBtn.style.backgroundColor = '#6fd673'
    inputBtn.style.color = 'white';
    inputBtn.style.cursor='pointer';
    inputBtn.style.padding = '10px 5px';
    inputBtn.style.border = 'none'
    inputBtn.addEventListener('click',()=>{
      alert(`${input.value}`);
      note.style.display = 'none';
    })

    NoteInput.appendChild(title);
    NoteInput.appendChild(input);
    NoteInput.appendChild(inputBtn);
  }
  note.appendChild(NoteInput);
}

const showNoteModal = (s)=>{
    let note = document.getElementsByClassName('highlighted-note-modal-container')[0];
    if(note){
      note.style.display = "flex";
    }
    else if(!note){
      note = document.createElement('div');
      note.style.display = 'flex';
      note.style.width = '100%';
      note.style.height = '100%';
      note.style.backgroundColor = 'rgba(0,0,0,0.4)';
      note.style.position = 'fixed';
      note.style.zIndex = '1000';
      note.style.top= '0';
      note.style.left='0';
      note.style.right='0';
      note.style.bottom='0';
      note.style.justifyContent = 'center';
      note.style.alignItem = 'center';
      note.classList.add('highlighted-note-modal-container');
      // note.addEventListener('click',()=>{
      //   note.style.display = 'none';
      // })
      document.body.appendChild(note);
    }
    if(s=="new_note") showNoteInput(); 
}
const newHighlight = async (color, textColor) => {
  const selection = window.getSelection().toString();
  if (selection) {
    showNoteModal('new_note');
    const span = document.createElement("span");
    span.style.backgroundColor = color;
    span.style.color = textColor;
    span.textContent = selection;
    span.classList.add(`highlighted-text`);
    span.addEventListener('click',()=>{
      showNoteModal();
    })
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
