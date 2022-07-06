let table = document.querySelector("#tblHistory");
let ratingLabels = ["Fine", "Bad", "Terrible"];
let categoryLabels = ["Audio_Quality", "Accents", "Enunciation", "Background_Noise"];
let monthAbbreviatedNames = { Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June", Jul: "July", Aug: "Augest", Sep: "September", Oct: "October", Nov: "November", Dec: "December" }
let monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// make a button that opens the tag modal
let createModalButton = (id) => {
    let buttonElement = document.createElement("button");
    buttonElement.type = "button";
    buttonElement.innerText = "Add Tags";
    buttonElement.id = `open-modal-button-for-${id}`;
    buttonElement.onclick = () => { toggleOptionsModal(id) }
    return buttonElement;
}

// make a background overlay
let createBackgroundOverlay = (id) => {
    let overlay = document.createElement("div");
    overlay.innerHTML = "backgroundOverlay";
    overlay.classList.add("backgroundOverlay");
    overlay.onclick = () => { closeModal(id, overlay) };
    document.body.append(overlay);
}

// close the modal that's open using the id
let closeModal = (id, overlay) => {
    let modal = document.querySelector(`#modal-for-${id}`);
    modal.classList.replace("showModal", "hideModal");
    overlay.remove();
}

// toggle modal to show or hide
let toggleOptionsModal = (id) => {
    createBackgroundOverlay(id);
    let modal = document.querySelector(`#modal-for-${id}`);
    if (modal.classList.contains("showModal")) {
        modal.classList.replace("showModal", "hideModal");
    }
    else {
        modal.classList.replace("hideModal", "showModal")
    }
}

// make the radio buttons for the tag choices

let createRadioButton = (name, id) => {
    let radioBtn = document.createElement("input");
    radioBtn.type = "radio";
    radioBtn.name = `${name}-for-${id}`;
    radioBtn.classList.add(`${name}-for-${id}`);
    return radioBtn;
}

// make the label for the radio buttons

let createLabel = (labelText, className) => {
    let label = document.createElement("label");
    label.innerHTML = labelText;
    label.classList.add(className);
    return label;
}

// make the container for the radio buttons

let createRadioContainer = () => {
    let div = document.createElement("div");
    div.classList.add("radioContainer");
    return div;
}

// make the modal container
let createModalContainer = (id) => {
    let modal = document.createElement("div");
    modal.id = `modal-for-${id}`;
    modal.classList.add("myModal");
    modal.classList.add("hideModal");
    return modal;
}

// create the container for the radio button and label
let createRadioLabelAndButtonContainer = () => {
    let radioBtnAndLabelContainer = document.createElement("div");
    radioBtnAndLabelContainer.classList.add("radioBtnAndLabelContainer");
    return radioBtnAndLabelContainer;
}

// append the radio label and radio button to a container
let appendRadioLabelAndButtonToContainer = (i, j, id) => {
    let radioLabel = createLabel(ratingLabels[j], "radioLabel");
    let radioBtn = createRadioButton(categoryLabels[i], id);
    if (j === 0) {
        radioBtn.checked = true;
    }
    let radioBtnAndLabelContainer = createRadioLabelAndButtonContainer();
    radioBtnAndLabelContainer.append(radioLabel);
    radioBtnAndLabelContainer.append(radioBtn);
    return radioBtnAndLabelContainer;
}

// make the tag category container
let createTagCategoryContainer = (i) => {
    let tagCategoryDiv = document.createElement("div");
    tagCategoryDiv.classList.add("tagCategoryContainer")
    tagCategoryDiv.append(createLabel(categoryLabels[i], "headingLabel"));
    return tagCategoryDiv;
}

// assemble the modal
let createModal = (id, date) => {
    let modal = createModalContainer(id);

    for (let i = 0; i < 4; i++) {
        // create tag category div
        let tagCategoryDiv = createTagCategoryContainer(i);
        // append radio button container to modal
        let radioContainer = createRadioContainer();

        for (let j = 0; j < 3; j++) {
            let radioBtnAndLabelContainer = appendRadioLabelAndButtonToContainer(i, j, id);
            radioContainer.append(radioBtnAndLabelContainer);
        }
        tagCategoryDiv.append(radioContainer)
        modal.append(tagCategoryDiv)
    }
    modal.append(createSubmitTagValuesButton(id, date));
    return modal;
}

// get the date TD element
let getDateTDElement = (i) => {
    let allTDs = table.children[0].children[i].querySelectorAll("td");
    return allTDs[2];
}

// get the TD element
let getTDElement = (i) => {
    return table.children[0].children[i].querySelector("td");
}

// get the TD element's id
let getTDElementId = (TDElement) => {
    return TDElement.innerHTML.trim();
}

// make submit button that takes the chosen tag values and uploads to the transcription tracker
let createSubmitTagValuesButton = (id, date) => {
    let button = document.createElement("button");
    button.type = "button";
    button.dataset.date = `${date.year}-${date.month}`;
    button.innerText = "Submit";
    button.id = `submit-for-${id}`;
    button.onclick = () => { submitTags(id, date) };
    return button;
}

// submit the tags to the transcription tracker
let submitTags = (id, date) => {
    let radioButtonValues = getRadioButtonValues(id);
    let accent = radioButtonValues["accentRadioButtons"];
    let audioQuality = radioButtonValues["audioQualityRadioButtons"];
    let backgroundNoise = radioButtonValues["backgroundNoiseRadioButtons"];
    let enunciation = radioButtonValues["enunciationRadioButtons"];
    chrome.runtime.sendMessage({
        tags: {
            accent,
            audioQuality,
            backgroundNoise,
            enunciation,
            id: id,
            date: date
        }
    },  response=>{
        console.log(response.result)
        if( response.result){
            styleModalButton(id, date);
            displaySubmitTagsMessage(id, true)
        }
        else{
            displaySubmitTagsMessage(id, false)
        }
    });
}

// display a message if the submission of the tags was successful or not
let displaySubmitTagsMessage = (id, wasSuccessful)=>{
    let message = wasSuccessful ? "Submitted tags!" : "Could not submit tags, please try again";
    let containerStyle = wasSuccessful ? "messageContainerSuccess" : "messageContainerFailure";
    let messageContainer = document.createElement("div");
    messageContainer.classList.add("messageContainer");
    messageContainer.classList.add(containerStyle);
    messageContainer.id = `message-container-for-${id}`;
    let span = document.createElement("span");
    span.innerText = message;
    messageContainer.append(span);
    document.getElementById(`modal-for-${id}`).append(messageContainer);
    setTimeout(() => {
        document.getElementById(`message-container-for-${id}`).remove();
    }, 5000);
}

// get the values of the radio buttons
let getRadioButtonValues = (id) => {
    let radioButtonHandles = selectRadioButtons(id);
    let radioValues = {};
    for (let i = 0; i < Object.keys(radioButtonHandles).length; i++) {
        radioValues[Object.keys(radioButtonHandles)[i]] = getSelectedValueFromRadioButtonsGroup(radioButtonHandles[Object.keys(radioButtonHandles)[i]])
    }
    return radioValues;
}

// get  the radio buttons from each category
let selectRadioButtons = (id) => {
    return {
        audioQualityRadioButtons: document.querySelectorAll(`.Audio_Quality-for-${id}`),
        accentRadioButtons: document.querySelectorAll(`.Accents-for-${id}`),
        enunciationRadioButtons: document.querySelectorAll(`.Enunciation-for-${id}`),
        backgroundNoiseRadioButtons: document.querySelectorAll(`.Background_Noise-for-${id}`)
    };
}

// get the true value from a group of radio buttons
let getSelectedValueFromRadioButtonsGroup = (radioButtonGroup) => {
    let selectedValue;
    radioButtonGroup.forEach((btn, index) => {
        if (btn.checked) {
            selectedValue = ratingLabels[index];
        }
    })
    return selectedValue;
}

// style the button that opens the modal based on if the job has already been tagged
let styleModalButton = (id, date) => { 
    let button = document.getElementById(`open-modal-button-for-${id}`);
    if(button.classList.contains("btnUpdateTag")){
        button.classList.remove("btnUpdateTag");
    }
    else if(button.classList.contains("btnAddTag")){
        button.classList.remove("btnAddTag");
    }
    if (button) {
        chrome.runtime.sendMessage({ queryJob: { id, date: date } }, response => {
            button.classList.add(response.result ? "btnUpdateTag" : "btnAddTag");
            button.innerText = response.result ? "Update Tags" : "Add Tags";
        })
    }
}

// loop over each job entry and 
globalThis.addTaggingForEachJob = () => {
    for (let i = 1; i < table.children[0].children.length - 1; i++) {
        // get the job id, job date, job id element handle, job date element handle
        let jobInfo = getJobInfo(i); 

        if (jobInfo.id) {
            assignIdToJobIdColumn(jobInfo.id, jobInfo.idHandle);
            assignClassToJobIdColumn(jobInfo.idHandle) 
            assignIdToJobDateColumn(jobInfo.id, jobInfo.dateHandle); 
            clearInnerTextOfJobIDColumn(jobInfo.idHandle); 

            let modal = createModal(jobInfo.id, jobInfo.date); 
            let openModalBtn = createModalButton(jobInfo.id); 
            appendOpenModalBtnToJobIdColumn(jobInfo.idHandle, openModalBtn); 
            appendModalToJobIdColumn(modal, jobInfo.idHandle);

            styleModalButton(jobInfo.id, jobInfo.date);
        }
    }

}

// append the entire modal to the job id column
let appendModalToJobIdColumn = (modal, idHandle) => {
    idHandle.append(modal);
}

// append the button that opens the modal
let appendOpenModalBtnToJobIdColumn = (idHandle, toggleModalBtn) => {
    idHandle.append(toggleModalBtn);
}

// assign the id of a job to the job id column
let assignIdToJobIdColumn = (id, idHandle) => {
    idHandle.id = `job-id-column-for-${id}`;
}

// assign class for styling of job id column
let assignClassToJobIdColumn = (idHandle) => {
    idHandle.classList.add("jobIdColumn");
}

// assign the id of a job to the job date column
let assignIdToJobDateColumn = (id, dateHandle) => {
    dateHandle.id = `job-date-column-for-${id}`;
}
// remove the inner text of the job id columnn
let clearInnerTextOfJobIDColumn = (idHandle) => {
    idHandle.innerText = "";
}

// return the id and the date of a job in the table using its position in the table
let getJobInfo = (i) => {
    let idColumn = getTDElement(i);
    let id = getTDElementId(idColumn);
    let dateColumn = getDateTDElement(i);
    let date = getJobDate(dateColumn);

    return {
        idHandle: idColumn,
        id: id,
        dateHandle: dateColumn,
        date: date
    }
}

// get the date text from the date column element
let getJobDate = (dateColumn) => {
    let dateText = dateColumn.innerHTML.trim();
    let convertedDate = getConvertedDate(dateText);
    return {
        month: monthsArray[convertedDate.getMonth()],
        year: convertedDate.getFullYear()
    }
}

// convert the date to gmt+2
let getConvertedDate = (dateText) => {
    let date = dateText.substring(0, 2);
    let month = dateText.substring(3, 6);
    let year = dateText.substring(7, 11);
    let time = dateText.substring(12);
    let dateObject = new Date(`${monthAbbreviatedNames[month]} ${date}, ${year} ${time}`);
    dateObject.setHours((dateObject.getHours() + 2));
    return dateObject;
}