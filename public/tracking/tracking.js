// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
// Import Firebase authentication modules
import { signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtOmcCPkeoMyZq_rhB7LsuB1CakLYwCEQ",
  authDomain: "arctrack-main.firebaseapp.com",
  databaseURL: "https://arctrack-main.firebaseio.com",
  projectId: "arctrack-main",
  storageBucket: "arctrack-main.appspot.com",
  messagingSenderId: "280162320438",
  appId: "1:280162320438:web:d61a95eca202a80e45d897",
  measurementId: "G-RPV5ZD0F07",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);
const markers = {}; // To store markers for search functionality

// DOM Elements
const loginModal = document.getElementById("loginModal");
const loginButton = document.getElementById("loginButton");
const menuButton = document.getElementById("menuButton");
const closeButton = document.getElementById("closeButton");
const overlay = document.getElementById("overlay");
const sidePanel = document.getElementById("sidePanel");
const searchButton = document.getElementById("searchButton");
const searchBar = document.getElementById("search-bar");

// Ensure the modal is initially hidden
if (loginModal) {
  loginModal.classList.add("hidden");
}

// Initialize Google Maps
let map;
let infoWindowTemplate = "";

function formatUnixTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function loadMaterialIcons() {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  link.rel = "stylesheet";
  document.head.appendChild(link); // Ensure the library is loaded into the document's head
}

function initMap() {
  loadMaterialIcons();

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 21.125681, lng: 82.794998 }, // Default center (India)
    zoom: 4,
  });

  // Preload the info window template
  preloadInfoWindowTemplate("./info-window.html");
}

// Attach the initMap function to the global window object
window.initMap = initMap;

// Preload InfoWindow Template
function preloadInfoWindowTemplate(templatePath) {
  return fetch(templatePath)
    .then((response) => response.text())
    .then((template) => {
      infoWindowTemplate = template;
    })
    .catch((error) => {
      console.error("Error preloading InfoWindow template:", error);
      infoWindowTemplate = "<p>Error loading content</p>";
    });
}

// Function to populate the info window content
function populateInfoWindowContent(data) {
  return infoWindowTemplate
    .replace(/{{deviceId}}/g, data.deviceId || "N/A")
    .replace(/{{img}}/g, data.img || "placeholder.png") // Prepend markers folder
    .replace(/{{Battery}}/g, data.Battery || "0%")
    .replace(/{{Signal}}/g, data.Signal || "No Signal")
    .replace(/{{DataCount}}/g, data.DataCount || "0")
    .replace(/{{LastGPSFix}}/g, data.LastGPSFix || "Unknown")
    .replace(/{{LastFixAccuracy}}/g, data.LastFixAccuracy || "Unknown")
    .replace(/{{TimeToFix}}/g, data.TimeToFix || "Unknown")
    .replace(/{{LastServerContact}}/g, data.LastServerContact || "Unknown");
}

// Attach and populate info window
function attachInfoWindow(marker, data) {
  const content = populateInfoWindowContent(data);
  const infoWindow = new google.maps.InfoWindow({ content });

  let openInfoWindow = null;
  marker.addListener("click", () => {
    if (openInfoWindow) openInfoWindow.close();
    infoWindow.open(map, marker);
    openInfoWindow = infoWindow;
  });

  google.maps.event.addListener(map, "click", () => {
    if (openInfoWindow) openInfoWindow.close();
  });
}

// Fetch and Display Device Data
function fetchDeviceData(userId) {
  const devicesRef = ref(database, `Users/${userId}/Devices`);

  onValue(devicesRef, (snapshot) => {
    if (!snapshot.exists()) {
      console.log("No devices found for this user.");
      return;
    }

    const devices = snapshot.val();
    Object.keys(devices).forEach((deviceId) => {
      const deviceRef = ref(database, `tags/${deviceId}/recent`);
      onValue(deviceRef, (deviceSnapshot) => {
        if (!deviceSnapshot.exists()) {
          console.log(`No recent data for device: ${deviceId}`);
          return;
        }

        const deviceData = deviceSnapshot.val();

        // Validate device data
        // if (!deviceData.Lat || !deviceData.Lng) {
        //   console.error(`Invalid coordinates for device: ${deviceId}`);
        //   return;
        // }

        const customMarker = {
          url: './markers/' + deviceData.img,
          scaledSize: new google.maps.Size(35, 35),
        };

        // Add Marker for Device
        const marker = new google.maps.Marker({
          position: { lat: deviceData.Lat, lng: deviceData.Lng },
          map,
          title: `Device: ${deviceId}`,
          icon: customMarker,
        });

        markers[deviceId] = marker;

        // Attach InfoWindow to Marker
        attachInfoWindow(marker, {
          deviceId,
          img: deviceData.img,
          Battery: deviceData.Battery,
          Signal: deviceData.Signal,
          DataCount: deviceData.Data,
          LastGPSFix: formatUnixTimestamp(deviceData.ts/1000),
          LastFixAccuracy: deviceData.hdop,
          TimeToFix: deviceData.LT,
          LastServerContact: formatUnixTimestamp(deviceData.tts),
        });
      });
    });
  });
}

// Search for a marker and open its info window
function searchAndFocusOnMarker(deviceId) {
  const marker = markers[deviceId];
  if (marker) {
    map.setCenter(marker.getPosition());
    map.setZoom(12);

    google.maps.event.trigger(marker, 'click');
  } else {
    alert("Device not found.");
  }
}

// Check authentication status on page load
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
    console.log("User logged in:", user.displayName);
    loginModal.classList.add("hidden");
    // alert(`Welcome, ${user.displayName}!`);
    document.getElementById("user-image").src = user.photoURL; // Replace userImageUrl with the actual image URL
    document.getElementById("user-name").textContent = user.displayName; // Replace userName with the user's actual name

    // Fetch devices for the logged-in user
    fetchDeviceData(user.uid);
  } else {
    console.log("No user logged in");
    loginModal.classList.remove("hidden");
  }
});

// Handle Google Login
loginButton.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in:", user.displayName);
      loginModal.classList.add("hidden");
    })
    .catch((error) => {
      console.error("Error during login:", error.message);
    });
});

// Load Google Maps Dynamically
function loadGoogleMapsScript() {
  const script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAsbF6BOz9gEXTFgwBYx1fi6nCfO1kN1bs";
  script.async = true;
  script.defer = true;

  script.onload = () => {
    initMap();
  };

  script.onerror = () => {
    console.error("Failed to load Google Maps script.");
  };

  document.body.appendChild(script);
}

function handleDownloadData(deviceId) {
  const url = `https://65.1.242.158:1880/file`;
  const data = { File: deviceId };

  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://65.1.242.158:1880/file',
      },
      body: JSON.stringify(data),
  })
  .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.blob();
  })
  .then(blobData => {
      // Create object URL for the blob data
      const blobUrl = URL.createObjectURL(blobData);
      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${deviceId}.csv`);
      // Append the link to the document body and trigger the click event
      document.body.appendChild(link);
      link.click();
      // Clean up: remove the link and revoke the object URL
      link.remove();
      URL.revokeObjectURL(blobUrl);
  })
  .catch(error => console.error('Error:', error));
}

function handleDetails(deviceId) {
  if (!deviceId) {
    console.error("Device ID is not defined.");
    alert("Error: Device ID is missing.");
    return;
  }

  // Redirect to the details page with the device ID as a query parameter
  const detailsPageUrl = `deviceDetails.html?deviceId=${encodeURIComponent(deviceId)}`;
  window.location.href = detailsPageUrl;
}

// Function to handle user logout
function handleLogout() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Redirect to login page or show confirmation
      alert("You have successfully logged out.");
      window.location.href = "login.html"; // Replace with your login page URL
    })
    .catch((error) => {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    });
}

// Add an event listener to the logout button
document.getElementById("logoutButton").addEventListener("click", handleLogout);

// Expose the function to the global window object
window.handleDownloadData = handleDownloadData;
window.handleDetails = handleDetails;

// Load the Google Maps script dynamically
document.addEventListener("DOMContentLoaded", () => {
  loadGoogleMapsScript();

  // Side panel functionality
  menuButton.addEventListener("click", () => {
    sidePanel.classList.remove("hidden");
    overlay.classList.remove("hidden");
  });

  closeButton.addEventListener("click", () => {
    sidePanel.classList.add("hidden");
    overlay.classList.add("hidden");
  });

  overlay.addEventListener("click", () => {
    sidePanel.classList.add("hidden");
    overlay.classList.add("hidden");
  });

  searchButton.addEventListener("click", () => {
    const deviceId = searchBar.value.trim();
    if (deviceId && markers[deviceId]) {
      searchAndFocusOnMarker(deviceId);
    } else {
      alert("Device not found. Please enter a valid Device ID.");
    }    
  })
});
