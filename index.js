// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  query,
  limitToLast,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyAbUQiKggphds5itr36T2TObwWKyPVQCTo",
  authDomain: "findaplayer-c9da7.firebaseapp.com",
  databaseURL: "https://findaplayer-c9da7-default-rtdb.firebaseio.com",
  projectId: "findaplayer-c9da7",
  storageBucket: "findaplayer-c9da7.appspot.com",
  messagingSenderId: "540450240179",
  appId: "1:540450240179:web:80c4ba68960c27b4f3e2c6",
});

const auth = getAuth();
const database = getDatabase(app);

function logIn() {
  console.log("hello");
  var logInEmailValue = document.querySelector("#login-email").value;
  var logInPassowrdValue = document.querySelector("#login-password").value;
  console.log({
    logInEmailValue,
    logInPassowrdValue,
  });

  signInWithEmailAndPassword(auth, logInEmailValue, logInPassowrdValue)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const accessToken = userCredential.user.accessToken;
      console.log(userCredential);
      if (accessToken) {
        window.user = user;
        document.querySelector("#home-nav-button").removeAttribute("disabled");
        document
          .querySelector("#connect-nav-button")
          .removeAttribute("disabled");
        document.querySelector("#maps-nav-button").removeAttribute("disabled");
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
    });
}

async function signUp() {
  var signUpEmailValue = document.querySelector("#signup-email").value;
  var signUpPassowrdValue = document.querySelector("#signup-password").value;

  try {
    await createUserWithEmailAndPassword(
      auth,
      signUpEmailValue,
      signUpPassowrdValue
    ).catch((err) => console.log(err));

    await updateProfile(auth.currentUser, {
      displayName: document.querySelector("#signup-name").value,
    }).catch((err) => console.log(err));
    window.location.href = "/index.html";
  } catch (err) {
    console.log(err);
  }
  console.log({
    signUpEmailValue,
    signUpPassowrdValue,
  });
}

function writeUserData() {
  var locationValue = document.querySelector("#location").value;
  var sportValue = document.querySelector("#sport").value;
  var playersNumberValue = document.querySelector("#players-number").value;
  var userId = auth.currentUser.uid;
  var name = auth.currentUser.displayName;
  var email = auth.currentUser.email;

  const db = getDatabase();
  set(ref(db, "users/" + userId), {
    username: name,
    email: email,
    location: locationValue,
    sport: sportValue,
    playersNumber: playersNumberValue,
  });
}

function handleEventClick(e, location) {
  var endPostCodeInput = document.querySelector("#end");
  endPostCodeInput.value = location;
}

function maps() {
  let userId;
  onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user) {
      const dbRef = ref(getDatabase());
      console.log(user.uid);
      get(child(dbRef, `users/`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            Object.values(snapshot.val()).forEach((v, i) => {
              console.log({ v, i });
              var sidebar = document.querySelector(".sidebar");
              sidebar.innerHTML += `
                <div class="sidebar-event-wrapper" onclick="handleEventClick(event, '${v.location}')">
                    <p class="sport">Sport: ${v.sport}</p> 
                    <p class="location">Location: ${v.location}</p> 
                    <p class="players-number">Number of Players: ${v.playersNumber}</p>
                </div>
                `;
            });
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log("No user");
    }
  });
}

window.writeUserData = writeUserData;
window.logIn = logIn;
window.signUp = signUp;
window.maps = maps;
window.handleEventClick = handleEventClick;

export { app };
