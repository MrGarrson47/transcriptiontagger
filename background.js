import { queryJob, updateJob } from "./firebase.js"

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.tags) {
        updateJob(request.tags)
            .then((result) => {
                sendResponse({ result: result })
            })
            .catch(e => {
                console.log(e);
            })
        return true;

    }
    else if (request.queryJob) {
        queryJob(request.queryJob).then(result => {
            sendResponse(result);
        }).catch(e => {
            let contentScriptTab = chrome.tabs.query({ url: "https://workhub.transcribeme.com/Account/WorkHistory" });
            contentScriptTab.then(tab => {
                chrome.tabs.sendMessage(tab[0].id, {
                    foundError: {
                        message: "An error occured when trying to establish a connection to the database:",
                        error: e.message
                    }
                })
            })

        })

        return true;
    }
})
