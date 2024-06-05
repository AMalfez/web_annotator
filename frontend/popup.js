let Notes = [];
const ShowNotesToDOM = ()=>{
    console.log(Notes);
    const notes_container = document.getElementsByClassName('highlights-container')[0];
    if(Notes.length===0){
        notes_container.innerHTML = '<div><p>No notes to show.</p></div>';
        return;
    }
    notes_container.innerText = "";
    Notes.forEach(note=>{
        let noteContainer = document.createElement('div');
        noteContainer.classList.add(`highlights time_${note.time}`);
        noteContainer.id = 'highlights';
        const p = document.createElement('p');
        p.innerText = note.note;
        const span = document.createElement('span');
        span.classList.add(`delete_note time_${note.time}`);
        span.innerText = 'X';
        span.addEventListener('click',()=>{
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {action: "DELETE_NOTE", time:note.time},  function(response){
                    if(!chrome.runtime.lastError){
                        Notes = [...response];
                        console.log(response)
                    } else{
                        console.log(chrome.runtime.lastError, 'error line 14')
                    }
                })
            })
        })
        noteContainer.appendChild(p);
        noteContainer.appendChild(span);
        notes_container.appendChild(noteContainer);
    })
}

document.addEventListener("DOMContentLoaded",()=>{
    ShowNotesToDOM();
    const addBtn = document.getElementsByClassName('add_highlight_btn')[0];
    const removeBtn = document.getElementsByClassName('remove_highlight_btn')[0];
    const colorPicker = document.getElementById('colorPicker');
    const textColorPicker = document.getElementById('textColorPicker');

    let highlightColor = "#ffff00";
    let textColor = "#000000";
    colorPicker.addEventListener('input',()=>{
        highlightColor = colorPicker.value;
    })
    textColorPicker.addEventListener('input',()=>{
        textColor = textColorPicker.value;
    })

    addBtn.addEventListener('click',()=>{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "NEW", highlightColor, textColor},  function(response){
                if(!chrome.runtime.lastError){
                    // Notes = [...response];
                    // ShowNotesToDOM();
                    console.log(response)
                } else{
                    console.log(chrome.runtime.lastError, 'error line 14')
                }
            })
        })
    })

    removeBtn.addEventListener('click',()=>{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "DELETE"},  function(response){
                if(!chrome.runtime.lastError){
                    // Notes = [...response];
                    // ShowNotesToDOM()
                    console.log(response)
                } else{
                    console.log(chrome.runtime.lastError, 'error line 14')
                }
            })
        })
    })
})