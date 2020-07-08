let url = window.location
const sheet = document.createElement('style')
document.body.appendChild(sheet);

//listens for commands
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //returns the page url
    if (request.task == "url") {
        sendResponse(url);
    }
    //updates the pages css
    else if (request.task == "css") {
        sheet.innerHTML = request.css;
    }
});

//asks for css from background script
chrome.runtime.sendMessage({ task: "send css", host: url.hostname }, (response) => {
});
