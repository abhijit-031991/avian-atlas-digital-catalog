// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
import { set } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

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
const database = getDatabase(app);

// Parse device ID from URL query string
function getDeviceIdFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("deviceId");
}

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

// Replace 'Loading...' with device ID in the header
function updateHeaderWithDeviceId(deviceId) {
  const headerDeviceId = document.getElementById("device-id");
  if (headerDeviceId) {
    headerDeviceId.textContent = deviceId || "Unknown";
  }
}

// Populate Device Details Panel
function populateDeviceDetailsPanel(data) {
  // Update text details
  document.getElementById("last-seen").textContent =
    formatUnixTimestamp(data.ts/1000) || "Unknown";
  document.getElementById("last-fix").textContent =
    formatUnixTimestamp(data.tts) || "Unknown";
  document.getElementById("accuracy").textContent =
    data.hdop || "Unknown";
  document.getElementById("time-to-fix").textContent =
    data.LT || "Unknown";

  // Update icon-value details
  document.getElementById("battery").textContent =
    data.Battery ? `${data.Battery}%` : "%%%";
  document.getElementById("signal").textContent = data.Signal || "0";
  document.getElementById("data-count").textContent = data.Count || "0";
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

// Initialize Google Map and add a marker
function initializeMap(lat, lng, img) {
  if (typeof google === "undefined" || !google.maps) {
    console.error("Google Maps JavaScript API is not loaded.");
    return;
  }

  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat, lng },
    zoom: 10,
  });

  // Add marker with custom icon
  new google.maps.Marker({
    position: { lat, lng },
    map,
    title: "Device Location",
    icon: {
      url: `./markers/${img}`,
      scaledSize: new google.maps.Size(40, 40),
    },
  });
}

// Retrieve device data from Firebase and update dropdown options
function fetchSettingsData(deviceId) {
  const settingsRef = ref(database, `tags/${deviceId}/settings`);

  get(settingsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const settings = snapshot.val();
        console.log("Settings Data:", settings);

        // Update dropdowns with the retrieved values
        document.getElementById("gps-frequency").value = settings.GFRQ || "";
        document.getElementById("gps-timeout").value = settings.GTO || "";
        document.getElementById("hdop").value = settings.HDOP || "";
        document.getElementById("transmission-frequency").value = settings.TFRQ || "";
      } else {
        console.error("No settings data found for this device.");
      }
    })
    .catch((error) => {
      console.error("Error fetching settings data:", error);
    });
}

// Retrieve device data from Firebase
function fetchDeviceData(deviceId) {
  const deviceRef = ref(database, `tags/${deviceId}/recent`);

  get(deviceRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Device Data:", data);

        // // Validate location and icon data
        // if (!data.Lat || !data.Lng || !data.img) {
        //   console.error("Missing required data: Lat, Lng, or img.");
        //   return;
        // }

        const lat = parseFloat(data.Lat);
        const lng = parseFloat(data.Lng);
        const img = data.img;

        if (!isNaN(lat) && !isNaN(lng)) {
          initializeMap(lat, lng, img);
        } else {
          console.error("Invalid location data.");
        }

        // Populate Device Details Panel
        populateDeviceDetailsPanel(data);
      } else {
        console.error("No data found for this device.");
      }
    })
    .catch((error) => {
      console.error("Error fetching device data:", error);
    });
}

// Function to save settings to Firebase
function saveSettingsToFirebase(deviceId) {
  if (!deviceId) {
    console.error("Device ID is missing.");
    alert("Device ID is missing. Unable to save settings.");
    return;
  }

  // Retrieve values from the text boxes
  const gpsFrequency = document.getElementById("gps-frequency").value;
  const gpsTimeout = document.getElementById("gps-timeout").value;
  const hdop = document.getElementById("hdop").value;
  const transmissionFrequency = document.getElementById("transmission-frequency").value;

  // Firebase reference for settings
  const settingsRef = ref(database, `tags/${deviceId}/settings`);

  // Create an object with the updated settings
  const updatedSettings = {
    GFRQ: parseInt(gpsFrequency) || 0,
    GTO: parseInt(gpsTimeout) || 0,
    HDOP: parseInt(hdop) || 0,
    TFRQ: parseInt(transmissionFrequency) || 0,
    NEW: true,
  };

  // Save the updated settings to Firebase
  set(settingsRef, updatedSettings)
    .then(() => {
      alert("Settings successfully saved!");
      console.log("Updated Settings:", updatedSettings);
    })
    .catch((error) => {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    });
}


// Load Google Maps Dynamically
function loadGoogleMapsScript() {
  const script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAsbF6BOz9gEXTFgwBYx1fi6nCfO1kN1bs";
  script.async = true;
  script.defer = true;

  script.onload = () => {
    const deviceId = getDeviceIdFromQuery();
    if (deviceId) {
      fetchDeviceData(deviceId);
    }
  };

  script.onerror = () => {
    console.error("Failed to load Google Maps script.");
  };

  document.body.appendChild(script);
}

// Handle Activate/Sleep button click
document.getElementById("activate-sleep").addEventListener("click", () => {
  document.getElementById("activatePopup").classList.remove("hidden");
});

// Handle Cancel button click
document.getElementById("cancelButton").addEventListener("click", () => {
  document.getElementById("activatePopup").classList.add("hidden");
});

// Handle Confirm button click
document.getElementById("confirmButton").addEventListener("click", () => {
  const selectedOption = document.querySelector('input[name="activationOption"]:checked');
  if (!selectedOption) {
    alert("Please select an option.");
    return;
  }

  const deviceId = getDeviceIdFromQuery(); // Function to get the device ID from the query string
  if (!deviceId) {
    alert("Device ID is missing. Unable to update status.");
    return;
  }

  // Prepare the data based on the selected option
  let statusUpdate = {};
  switch (selectedOption.value) {
    case "1":
      statusUpdate = { activate: true, ltr: false, wipe: false };
      break;
    case "2":
      statusUpdate = { activate: true, ltr: false, wipe: true };
      break;
    case "3":
      statusUpdate = { activate: false, ltr: false, wipe: false };
      break;
    default:
      alert("Invalid selection.");
      return;
  }

  // Update Firebase with the selected option
  const statusRef = ref(database, `tags/${deviceId}/status`);
  set(statusRef, statusUpdate)
    .then(() => {
      alert("Status updated successfully!");
      document.getElementById("activatePopup").classList.add("hidden");
    })
    .catch((error) => {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    });
});


// Main function to handle the page logic
document.addEventListener("DOMContentLoaded", () => {
  const deviceId = getDeviceIdFromQuery();

  if (deviceId) {
    // Update header with device ID
    updateHeaderWithDeviceId(deviceId);

    // Load Google Maps script and fetch data
    loadGoogleMapsScript();
    loadMaterialIcons();
  } else {
    console.error("Device ID is missing from the query string.");
  }  
  fetchSettingsData(deviceId);
});

// Event listener for the Save button
document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.querySelector("button.bg-blue-600");

  saveButton.addEventListener("click", () => {
    const deviceId = getDeviceIdFromQuery(); // Retrieve deviceId from query string
    if (deviceId) {
      saveSettingsToFirebase(deviceId);
    } else {
      alert("Device ID is missing. Unable to save settings.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const downloadButton = document.getElementById("downloadData");

  downloadButton.addEventListener("click", () => {
    const deviceId = getDeviceIdFromQuery(); // Use your existing function to fetch the device ID
    if (deviceId) {
      handleDownloadData(deviceId); // Call the function with the device ID
    } else {
      alert("Device ID is missing. Unable to download data.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const deviceSecretsButton = document.getElementById("deviceSecrets");

  deviceSecretsButton.addEventListener("click", () => {    
      alert("This feature is not available on the curernt generation of devices!");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const iconChange = document.getElementById("changeIcon");

  iconChange.addEventListener("click", () => {    
      alert("Custom Icon Feature will be dropping Soon!");
  });
});
