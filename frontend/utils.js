export async function getActiveTabURL() {
    const [tab] = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });
  
    return tab;
}
