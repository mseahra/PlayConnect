// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  signOut,
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
  push,
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

function onAuthChange() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      document.querySelector("#home-nav-button").classList.remove("disabled");
      document
        .querySelector("#connect-nav-button")
        .classList.remove("disabled");
      document.querySelector("#maps-nav-button").classList.remove("disabled");
      var loginButton = document.getElementById("login-nav-button");
      var logoutButton = document.getElementById("logout-nav-button");

      loginButton.style.display = "none";

      logoutButton.style.display = "block";

      return false;

      // ...
    } else {
      // User is signed ot
      // ...
    }
  });
}

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
        console.log(accessToken);
        document.querySelector("#home-nav-button").classList.remove("disabled");
        document
          .querySelector("#connect-nav-button")
          .classList.remove("disabled");
        document.querySelector("#maps-nav-button").classList.remove("disabled");

        window.location.replace("/");
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
    });
}

async function logOut() {
  var logInEmailValue = document.querySelector("#login-email").value;
  var logInPassowrdValue = document.querySelector("#login-password").value;
  console.log({
    logInEmailValue,
    logInPassowrdValue,
  });

  signOut(auth)
    .then(() => {
      // Sign-out successful.
      window.location.reload();
    })
    .catch((error) => {
      // An error happened.
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
}

function writeUserData() {
  var locationValue = document.querySelector("#location").value;
  var sportValue = document.querySelector("#sport").value;
  var playersNumberValue = document.querySelector("#players-number").value;
  var userId = auth.currentUser.uid;
  var name = auth.currentUser.displayName;
  var email = auth.currentUser.email;

  const db = getDatabase();
  push(ref(db, "users/" + userId), {
    username: name,
    email: email,
    location: locationValue,
    sport: sportValue,
    playersNumber: playersNumberValue,
  });

  window.location.reload();
}

function handleEventClick(e, location) {
  var endPostCodeInput = document.querySelector("#end");
  endPostCodeInput.value = location;
}

function maps() {
  onAuthChange();
  let userId;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const dbRef = ref(getDatabase());
      console.log(user.uid);
      get(child(dbRef, `users/`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            Object.values(snapshot.val()).forEach((v, i) => {
              console.log({ v, i });
              var sidebar = document.querySelector(".sidebar");
              Object.values(v).forEach((value, index) => {
                sidebar.innerHTML += `
                <div class="sidebar-event-wrapper" onclick="handleEventClick(event, '${value.location}')">
                    <p class="sport">Sport: ${value.sport}</p> 
                    <p class="location">Location: ${value.location}</p> 
                    <p class="players-number">Number of Players: ${value.playersNumber}</p>
                </div>
            `;
              });
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

function connect() {
  onAuthChange();
  onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user) {
      const dbRef = ref(getDatabase());
      console.log(user.uid);

      const userId = user.uid;

      get(child(dbRef, `users/${userId}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const snapshots = snapshot.val();

            console.log({ snapshots });
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

function calculateRoute() {
  var startInput = document.getElementById("start");
  var endInput = document.getElementById("end");
  var startPostcode = startInput.value;
  var endPostcode = endInput.value;

  var geocoder = L.Control.Geocoder.nominatim();

  geocoder.geocode(startPostcode, function (results) {
    var startLocation = results[0].center;

    geocoder.geocode(endPostcode, function (results) {
      var endLocation = results[0].center;

      var control = L.Routing.control({
        waypoints: [
          L.latLng(startLocation.lat, startLocation.lng),
          L.latLng(endLocation.lat, endLocation.lng),
        ],
      }).addTo(map);

      control.on("routesfound", function (e) {
        var routes = e.routes;
        console.log(routes);

        e.routes[0].coordinates.forEach(function (coord, index) {
          setTimeout(function () {
            marker.setLatLng([coord.lat, coord.lng]);
          }, 100 * index);
        });
      });
    });
  });
}

window.calculateRoute = calculateRoute;
window.writeUserData = writeUserData;
window.onAuthChange = onAuthChange;
window.logIn = logIn;
window.signUp = signUp;
window.maps = maps;
window.handleEventClick = handleEventClick;
window.logOut = logOut;
window.connect = connect;

export { app };
