import { queryJob, updateJob } from "./firebase.js"

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.tags) {
        updateJob(request.tags)
            .then((result) => {
                sendResponse({ result: result })
            })
            .catch(e=>{
                console.log(e);
            })
            return true;

    }
    else if (request.queryJob) {
        queryJob(request.queryJob).then(result => {
            sendResponse({ result: result });
        }).catch(e => { console.log(e) })

        return true;
    }
})
