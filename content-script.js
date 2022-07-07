let createErrorMessage = (request)=>{
    if (request.foundError) {
        let previousErrorContainer = document.getElementById("db-connection-error");
        if (!previousErrorContainer) {
            let errorMessageContainer = document.createElement("div");
            let generalMessage = document.createElement("span");
            let errorMessage = document.createElement("span");
            errorMessage.innerText = request.foundError.error;
            generalMessage.innerText = request.foundError.message;
            errorMessageContainer.classList.add("dbConnectionErrorContainer");
            errorMessageContainer.id = "db-connection-error";
            errorMessageContainer.append(generalMessage);
            errorMessageContainer.append(errorMessage);
            document.body.append(errorMessageContainer);
        }
    }
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
    createErrorMessage(request)
})
globalThis.addTaggingForEachJob();

