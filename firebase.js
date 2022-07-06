// Import the functions you need from the SDKs you need
import { initializeApp } from "./firebaseFiles/firebase-app.js";
import { getDatabase, ref, child, get, update } from "./firebaseFiles/firebase-database.js";

let monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZtwc1-uknDuGCvIenRXPOOdNyGCeoN_M",
    authDomain: "transcriptiontracker.firebaseapp.com",
    databaseURL: "https://transcriptiontracker-default-rtdb.firebaseio.com",
    projectId: "transcriptiontracker",
    storageBucket: "transcriptiontracker.appspot.com",
    messagingSenderId: "87847571379",
    appId: "1:87847571379:web:72e88ea08c14db0f0945c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const updateJob = async (tags) => {

    return await update(ref(db, `${tags.date.year}/${tags.date.month}/${tags.id}/tags`), {
        accent: tags.accent,
        audioQuality: tags.audioQuality,
        backgroundNoise: tags.backgroundNoise,
        enunciation: tags.enunciation
    })
        .then(() => {
            return true;
        })
        .catch(e => {
            console.log(e);
            return false;
        })

}

let dbRef = ref(db);
export const queryJob = async (searchObject) => {
    let { date } = searchObject;
    return await get(child(dbRef, `${date.year}/${date.month}/${searchObject.id}/tags`))
        .then((snapshot => {
            if (snapshot.exists()) {
                return {
                    tags: snapshot.val()
                }
            }
            return false;
        }))
}
