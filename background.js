//configures chrome
chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https', 'http', '*'] },
        })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
    //listens for init requests
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.task == "send css") {
            sendResponse("soon")
            sendCSS(request.host)
        }
        else {
            sendResponse("no")
        }
    })
});

//sends the selected css to the front ent
const sendCSS = (host) => {
    chrome.storage.local.get([host], (value) => {
        value = value[host]
        if (value.selected) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { task: 'css', css: value[value.selected] }, (res) => {
                })
            })
        }
    })
}



