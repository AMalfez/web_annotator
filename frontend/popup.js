document.addEventListener("DOMContentLoaded",()=>{
    const addBtn = document.getElementsByClassName('add_highlight_btn')[0];
    const removeBtn = document.getElementsByClassName('remove_highlight_btn')[0];

    addBtn.addEventListener('click',()=>{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "NEW"},  function(response){
                if(!chrome.runtime.lastError){
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
                    console.log(response)
                } else{
                    console.log(chrome.runtime.lastError, 'error line 14')
                }
            })
        })
    })
})