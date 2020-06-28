const css = document.querySelector("textarea")
const scopes = document.querySelector("#scopes")

let url = {}
let options = {}

//asks the content script for the url
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { task: "url" }, (res) => {
        //stores the location object
        url = res
        //gets the data sets for the specific page
        chrome.storage.local.get([url.hostname], (value) => {
            options = value[url.hostname]
            //renders options onto the select tag
            if (options) {
                for ([key, data] of Object.entries(options)) {
                    if (key != "selected") {
                        scopes.innerHTML += `<option value = "${key}" ${(options.selected == key) ? "selected" : ""}>${key}</option>`
                    }
                }
                if (options.selected != "default") {
                    css.value = options[options.selected]
                    css.removeAttribute("readonly")
                }
            }
            else {
                options = {}
            }
            scopes.innerHTML += '<option value = "new">New Style</option>'
        })


    })
})

//updates the css in the textarea when the location is updated
scopes.addEventListener('change', () => {
    //if a new scope is being made
    if (scopes.value == "new") {
        css.value = ""
        //creating an input for the new scope name
        let input = document.createElement("INPUT");
        input.setAttribute("type", "text");
        input.setAttribute("id", "newScope")
        input.setAttribute("placeholder", "Scope Name")
        //once the input it deselected
        input.onblur = () => {
            let newScope = input.value
            options.selected = newScope
            //brings back the select
            document.querySelector("#newScope").replaceWith(scopes)
            //tests to make sure a name was entered
            if (newScope != "") {
                //if it isn't already a thing
                if (!options[newScope]) {
                    scopes.innerHTML += `<option value = "${newScope}">${newScope}</option>`
                }
                //otherwise just display the only that already exists
                else {
                    css.value = options[newScope]

                }
                css.removeAttribute("readonly")
                scopes.value = newScope

            }
            updateCSS()
        }
        scopes.replaceWith(input)
    }
    //protects the default
    else if (scopes.value == "default") {
        options.selected = scopes.value;
        updateData();
        css.value = "You cannot edit the css of the default layout";
        css.setAttribute("readonly", true);
        updateCSS()
    }
    //updates the textarea and sets selected
    else {
        css.value = options[scopes.value];
        options.selected = scopes.value;
        updateData();
        css.removeAttribute("readonly")
        updateCSS()
    }
})

//when user updates the css of a page
css.addEventListener('input', () => {
    options[scopes.value] = css.value;
    updateData();
    updateCSS();
})

//updates the chrome storage
const updateData = () => {
    chrome.storage.local.set({ [url.hostname]: options }, () => { });
}

//updates the content script
const updateCSS = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { task: 'css', css: options[options.selected] }, (res) => {
        })
    })
}
